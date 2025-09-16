"use client"

import { useState, useCallback } from "react"
import { Select, SelectItem } from "@heroui/react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Tooltip, Divider } from "@heroui/react"
import { X, Plus, CheckCircle, Copy, Globe, EyeOff, Eye, Smartphone, Monitor, ImageIcon } from "lucide-react";
import { clientApp } from "@/types"

import { createUser } from "@/actions/createUser"
import GrantsCheck from "../Common/GrantsCheck";



const appTypes = [
  {
    label: "Aplicación Web",
    value: "web",
    description: "SPA, Aplicaciones web tradicionales",
    icon: <Globe className="w-4 h-4 text-blue-600" />
  },
  {
    label: "Aplicación Mobil",
    value: "mobil",
    description: "iOS, Android, React Native",
    icon: <Smartphone className="w-4 h-4 text-green-600" />
  },
  {
    label: "Aplicación de Escritorio",
    value: "desktop",
    description: "Windows, macOS, Linux",
    icon: <Monitor className="w-4 h-4 text-purple-600" />
  }
]

// Componente Modal para crear aplicación
interface CreateApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  appData: clientApp | null
  selectedGrants: Array<string>
  imageDownloaded: string
}

function CreateApplicationModal({ isOpen, onClose, appData, selectedGrants, imageDownloaded }: CreateApplicationModalProps) {

  const [formData, setFormData] = useState<clientApp | null>(appData);
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string>(imageDownloaded)
  const [isDragActive, setIsDragActive] = useState(false)
  const [groupSelected, setGroupSelected] = useState<Array<string>>(selectedGrants);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string
    type?: string
    redirectUris?: string
    grants?: string
    icon?: string
  }>({})

  const isValidUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === "http:" || urlObj.protocol === "https:"
    } catch {
      return false
    }
  }

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    // Validar nombre
    if (!formData?.app_name?.trim()) {
      newErrors.name = "El nombre de la aplicación es requerido"
    }

    // Validar tipo
    if (!formData?.app_type) {
      newErrors.type = "Debes seleccionar un tipo de aplicación"
    }
    if (!formData?.redirect_callback) {
      newErrors.redirectUris = "Debes agregar al menos una Redirect URI"
    } else {
      if (!isValidUrl(formData.redirect_callback)) {
        newErrors.redirectUris = "URL no valida"
      }
    }

    // Validar grants
    if (groupSelected?.length === 0) {
      newErrors.grants = "Debes seleccionar al menos un OAuth Grant"
    }

    // Validar icono
    if (!iconPreview) {
      newErrors.icon = "El icono de la aplicación es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith("image/")) {
      setIconFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setIconPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])






  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Error al copiar:", err)
    }
  }

  const handleSubmit = async () => {
    validateForm();
    console.log(groupSelected);
    console.log(await createUser(formData))
  };

  const handleSelectionChange = (e: any) => {
    setFormData(prev => ({
      ...prev!,
      app_type: e.target.value,
    }));
  };

  const handlerChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const target = e.target as unknown as HTMLInputElement;
    const { name, value } = target;

    if (name) {
      setFormData(prev => ({
        ...prev!,
        [name]: value,
      }));
    }

  }

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const onDropHandler = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragActive(false)

      const files = Array.from(e.dataTransfer.files)
      onDrop(files)
    },
    [onDrop],
  )
  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      onDrop(Array.from(files))
    }
  }

  const removeIcon = () => {
    setIconFile(null)
    setIconPreview("")
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crear Nueva Aplicación OAuth
          </div>
        </ModalHeader>
        <ModalBody>

          <div className="space-y-6">
            <form onChange={handlerChange}>
              {/* Información básica */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">Información Básica</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    defaultValue={formData?.app_name}
                    aria-label=""
                    name="app_name"
                    label="Nombre de la aplicación"
                    size="sm"
                    errorMessage={errors.name}
                    variant="bordered"
                    isRequired
                    isInvalid={!!errors.name}
                  />
                  {!appData && (<div className="space-y-2">
                    <Select
                      aria-label="1"
                      classNames={{
                        base: "max-w-xs",
                        trigger: "h-12",
                      }}
                      items={appTypes}
                      onChange={handleSelectionChange}
                      isInvalid={!!errors.type}
                      errorMessage={errors.type}
                      labelPlacement="outside"
                      placeholder="Tipo de aplicación"
                      renderValue={(items) => {
                        return items.map((item) => (
                          <div key={item.key} className="flex items-center gap-2">
                            {item.data?.icon}
                            <div className="flex flex-col">
                              <span>{item.data?.label}</span>
                            </div>
                          </div>
                        ));
                      }}
                    >
                      {(user) => (
                        <SelectItem key={user.value} textValue={user.label}>
                          <div className="flex gap-2 items-center">
                            {user.icon}
                            <div className="flex flex-col">
                              <span className="text-small">{user.label}</span>
                              <span className="text-tiny text-default-400">{user.description}</span>
                            </div>
                          </div>
                        </SelectItem>
                      )}
                    </Select>
                  </div>)}

                </div>
                <Input
                  label="Descripción"
                  defaultValue={formData?.description}
                  aria-label=""
                  name="description"
                  placeholder="Aplicación web para gestión de usuarios..."
                  variant="bordered"
                />
                {/* Drop Zone para Icono */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Icono de la aplicación {errors.icon && <span className="text-danger text-xs ml-2">{errors.icon}</span>}</label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${isDragActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-default-300 dark:border-default-600 hover:border-blue-400 hover:bg-default-50 dark:hover:bg-default-900/30"
                      }`}
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                    onDragOver={onDragOver}
                    onDrop={onDropHandler}
                  >
                    {iconPreview ? (
                      <div className="flex items-center justify-center gap-4">
                        <img
                          src={iconPreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-16 h-16 rounded-xl object-cover shadow-md"
                        />
                        <div className="flex-1 text-left">
                          <p className="font-medium text-foreground">{iconFile?.name}</p>
                          <p className="text-sm text-default-500">{iconFile && (iconFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        {!appData && (
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color="danger"
                            disabled={appData === null ? false : true}
                            onPress={removeIcon}
                            className="hover:bg-danger-100 dark:hover:bg-danger-900/30"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                        {appData && (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileInput}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        )}


                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-xl bg-default-100 dark:bg-default-800 flex items-center justify-center mx-auto mb-4">
                          <ImageIcon className="w-8 h-8 text-default-400" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium text-foreground">
                            {isDragActive ? "Suelta la imagen aquí" : "Arrastra una imagen o haz clic para seleccionar"}
                          </p>
                          <p className="text-sm text-default-500">PNG, JPG, GIF hasta 2MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileInput}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {!appData && (<div>
                  <div className="flex gap-2">
                    <Input
                      defaultValue={formData?.client_id}
                      name="client_id"
                      label="Client ID"
                      isReadOnly
                      readOnly
                      size="sm"
                      classNames={{
                        input: "font-mono text-sm",
                      }}
                    />
                    <Tooltip content={copiedField === "clientId" ? "¡Copiado!" : "Copiar Client ID"}>
                      <Button
                        isIconOnly
                        variant="flat"
                        disabled={formData?.client_id ? false : true}
                        onPress={() => handleCopy(formData?.client_id ?? "", "clientId")}
                        className={`${copiedField === "clientId"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "bg-default-100"
                          }`}
                      >
                        {copiedField === "clientId" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </Tooltip>
                  </div>
                </div>)}
                {!appData && (<div>
                  <div className="flex gap-2">
                    <Input
                      size="sm"
                      defaultValue={formData?.client_secret}
                      name="client_secret"
                      label="Client Secret"
                      value={showSecret ? formData?.client_secret : "•".repeat(formData?.client_secret?.length || 0)}
                      isReadOnly
                      readOnly
                      classNames={{
                        input: "font-mono text-sm",
                      }}
                      endContent={
                        <Button isIconOnly variant="light" size="sm" onPress={() => setShowSecret(!showSecret)}>
                          {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      }
                    />
                    <Tooltip content={copiedField === "clientSecret" ? "¡Copiado!" : "Copiar Client Secret"}>
                      <Button
                        isIconOnly
                        variant="light"
                        disabled={formData?.client_secret ? false : true}
                        onPress={() => handleCopy(formData?.client_secret ?? "", "clientSecret")}
                        className={`${copiedField === "clientSecret"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "bg-default-100"
                          }`}
                      >
                        {copiedField === "clientSecret" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </Tooltip>
                  </div>
                </div>)}

              </div>
            </form>
            <Divider />

            {/* OAuth Grants */}

            {!appData && (
              <GrantsCheck
                selectedGrants={groupSelected}
                operationType="CREATE"
                errorMsg={errors?.grants ?? null}
                setGroupSelected={setGroupSelected}
              />
            )}


            <Divider />

            {/* Configuración OAuth */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Configuración OAuth</h4>
              <form onChange={handlerChange}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Input
                      aria-label=""
                      label="Redirect URI"
                      name="redirect_callback"
                      variant="bordered"
                      type="textarea"
                      required
                      defaultValue={formData?.redirect_callback}
                      isInvalid={!!errors.redirectUris}
                      errorMessage={errors.redirectUris}
                    />
                  </div>
                  {/**
                   * <div>
                    <Input
                      label="Scopes"
                      placeholder="read, write, admin"
                      value={scopesInput}
                      onValueChange={setScopesInput}
                      variant="bordered"
                    />
                  </div>
                   */}

                </div>
              </form>
            </div>
          </div>

        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          >
            {appData === null ? "Crear" : "Actualizar"} Aplicación
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default CreateApplicationModal;