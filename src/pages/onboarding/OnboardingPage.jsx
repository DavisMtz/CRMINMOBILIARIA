import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../hooks/useAuth";
import { db, storage } from "../../firebase/config";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";
import { User, Phone, Building2, MapPin, Briefcase, Upload, Check } from "lucide-react";
import styles from "./OnboardingPage.module.css";

const STEPS = [
  { id: 1, label: "Foto de perfil", icon: <Upload size={16} /> },
  { id: 2, label: "Datos personales", icon: <User size={16} /> },
  { id: 3, label: "Datos profesionales", icon: <Briefcase size={16} /> },
];

const ZONES = [
  "Ciudad de México", "Monterrey", "Guadalajara", "Querétaro",
  "Puebla", "Cancún", "Tijuana", "León", "Otra",
];

const SPECIALTIES = [
  "Residencial", "Comercial", "Industrial", "Terrenos",
  "Lujo", "Vacacional", "Renta", "Inversión",
];

export default function OnboardingPage() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.photoURL ?? null);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: {
      displayName: user?.displayName ?? "",
      phone: "",
      whatsapp: "",
      city: "",
      zone: "",
      agency: "",
      license: "",
      experience: "",
      specialty: [],
      bio: "",
    },
  });

  const onDrop = useCallback((accepted) => {
    const file = accepted[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("La imagen no puede superar 5 MB"); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data) => {
    if (!avatarFile && !user?.photoURL) {
      toast.error("Por favor sube una foto de perfil");
      setStep(1);
      return;
    }
    setSaving(true);
    try {
      let photoURL = user?.photoURL ?? "";
      if (avatarFile) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, avatarFile);
        photoURL = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: data.displayName,
        phone: data.phone,
        whatsapp: data.whatsapp || data.phone,
        city: data.city,
        zone: data.zone,
        agency: data.agency,
        license: data.license,
        experience: Number(data.experience),
        specialty: data.specialty,
        bio: data.bio,
        photoURL,
        role: "advisor",
        onboardingCompleted: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await refreshProfile();
      toast.success("¡Perfil completado! Bienvenido a Atarax.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar el perfil. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>A</div>
          <span>Atarax</span>
        </div>
        <p className={styles.headerSub}>Completa tu perfil para comenzar</p>
      </div>

      <div className={styles.card}>
        {/* Stepper */}
        <div className={styles.stepper}>
          {STEPS.map((s, i) => (
            <div key={s.id} className={styles.stepWrap}>
              <div className={[styles.stepCircle, step > s.id ? styles.done : step === s.id ? styles.active : ""].join(" ")}>
                {step > s.id ? <Check size={14} /> : s.icon}
              </div>
              <span className={[styles.stepLabel, step === s.id ? styles.activeLabel : ""].join(" ")}>{s.label}</span>
              {i < STEPS.length - 1 && <div className={[styles.stepLine, step > s.id ? styles.doneLine : ""].join(" ")} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* ── STEP 1: Foto ── */}
          {step === 1 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Foto de perfil</h2>
              <p className={styles.stepDesc}>Tu foto genera confianza con los clientes. Usa una foto profesional.</p>

              <div className={styles.avatarSection}>
                {avatarPreview && (
                  <img src={avatarPreview} alt="Preview" className={styles.avatarPreview} />
                )}

                <div
                  {...getRootProps()}
                  className={[styles.dropzone, isDragActive ? styles.dragActive : ""].join(" ")}
                >
                  <input {...getInputProps()} />
                  <Upload size={28} className={styles.uploadIcon} />
                  {isDragActive ? (
                    <p>Suelta la imagen aquí</p>
                  ) : (
                    <>
                      <p className={styles.dropMain}>Arrastra tu foto o <span>haz clic para seleccionar</span></p>
                      <p className={styles.dropSub}>JPG, PNG o WebP · Máx 5 MB</p>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.actions}>
                <Button type="button" size="lg" fullWidth onClick={next}>
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Datos personales ── */}
          {step === 2 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Datos personales</h2>
              <p className={styles.stepDesc}>Esta información aparecerá en tu perfil de asesor.</p>

              <div className={styles.fields}>
                <Input
                  label="Nombre completo *"
                  icon={<User size={16} />}
                  placeholder="Tu nombre completo"
                  error={errors.displayName?.message}
                  {...register("displayName", { required: "El nombre es requerido", minLength: { value: 3, message: "Mínimo 3 caracteres" } })}
                />
                <Input
                  label="Teléfono *"
                  icon={<Phone size={16} />}
                  placeholder="+52 55 0000 0000"
                  type="tel"
                  error={errors.phone?.message}
                  {...register("phone", {
                    required: "El teléfono es requerido",
                    pattern: { value: /^[\d\s+\-()]{8,15}$/, message: "Teléfono inválido" },
                  })}
                />
                <Input
                  label="WhatsApp (si es diferente)"
                  icon={<Phone size={16} />}
                  placeholder="+52 55 0000 0000"
                  type="tel"
                  {...register("whatsapp")}
                />
                <Input
                  label="Ciudad *"
                  icon={<MapPin size={16} />}
                  placeholder="Tu ciudad"
                  error={errors.city?.message}
                  {...register("city", { required: "La ciudad es requerida" })}
                />
              </div>

              <div className={styles.actions}>
                <Button type="button" variant="secondary" size="lg" onClick={prev}>Atrás</Button>
                <Button type="button" size="lg" onClick={() => {
                  const v = getValues();
                  if (!v.displayName || v.displayName.length < 3) { toast.error("Ingresa tu nombre completo"); return; }
                  if (!v.phone) { toast.error("Ingresa tu teléfono"); return; }
                  if (!v.city) { toast.error("Ingresa tu ciudad"); return; }
                  next();
                }}>Continuar</Button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Datos profesionales ── */}
          {step === 3 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Datos profesionales</h2>
              <p className={styles.stepDesc}>Completa tu perfil de asesor inmobiliario.</p>

              <div className={styles.fields}>
                <Input
                  label="Agencia / Inmobiliaria"
                  icon={<Building2 size={16} />}
                  placeholder="Nombre de tu agencia (opcional)"
                  {...register("agency")}
                />
                <Input
                  label="Número de licencia / cédula"
                  icon={<Briefcase size={16} />}
                  placeholder="Licencia profesional (opcional)"
                  {...register("license")}
                />
                <Input
                  label="Años de experiencia *"
                  type="number"
                  placeholder="Ej. 5"
                  min="0" max="60"
                  error={errors.experience?.message}
                  {...register("experience", { required: "Indica tus años de experiencia", min: { value: 0, message: "Mínimo 0" } })}
                />

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Zona de cobertura *</label>
                  <select className={styles.select} {...register("zone", { required: true })}>
                    <option value="">Selecciona una zona</option>
                    {ZONES.map((z) => <option key={z}>{z}</option>)}
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Especialidades</label>
                  <div className={styles.chips}>
                    {SPECIALTIES.map((sp) => (
                      <label key={sp} className={styles.chip}>
                        <input type="checkbox" value={sp} {...register("specialty")} />
                        <span>{sp}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Bio / Presentación</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="Cuéntale a tus clientes sobre ti y tu experiencia..."
                    rows={3}
                    {...register("bio", { maxLength: { value: 400, message: "Máximo 400 caracteres" } })}
                  />
                  {errors.bio && <p className={styles.errorMsg}>{errors.bio.message}</p>}
                </div>
              </div>

              <div className={styles.actions}>
                <Button type="button" variant="secondary" size="lg" onClick={prev}>Atrás</Button>
                <Button type="submit" size="lg" loading={saving}>
                  Completar perfil
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
