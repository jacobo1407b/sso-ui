import { useState, useImperativeHandle } from "react"
import { Card, CardBody, CardHeader, RadioGroup, Radio, Divider, Input, useDisclosure, Chip, Avatar, Select, SelectItem, addToast } from "@heroui/react"
import { Globe, Palette, Monitor, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes";
import RequestServer from "@/lib/client/api-client";


const supportedLanguages = [
    {
        code: "en",
        name: "English",
        flag: "/us.svg"
    },
    {
        code: "es",
        name: "Español",
        flag: "/mx.svg"
    },
    {
        code: "pt",
        name: "Português",
        flag: "/br.svg"
    },
    {
        code: "fr",
        name: "Français",
        flag: "/fr.svg"
    },
    {
        code: "de",
        name: "Deutsch",
        flag: "/de.svg"
    }
];

interface PreferencesProps {
    languageProp: string;
    themeProp: string;
    id: string
    ref: any
}
function Preferences({ languageProp, themeProp, id, ref }: PreferencesProps) {
    const [language, setLanguage] = useState(languageProp);
    const [theme, setThemePage] = useState(themeProp);
    const { setTheme } = useTheme();

    const handlerLanguage = (e: any) => {
        setLanguage(e.target.value)
    }

    useImperativeHandle(ref, () => ({
        handleSavePreferences: async () => {
            if (language !== languageProp || theme !== themeProp) {
                await new RequestServer<null>("Util/SetPreferences")
                    .setQueryParams({ id: id })
                    .setPayload({
                        theme,
                        lang: language
                    })
                    .exec();
            }
            setTheme(theme);
        }
    }));


    return (
        <div className="space-y-6">
            {/* Idioma */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-default-200 dark:border-default-700 shadow-xl">
                <CardHeader className="pb-3">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        Idioma y Región
                    </h2>
                </CardHeader>
                <CardBody className="pt-0">
                    <div>
                        <label className="text-sm font-medium text-foreground mb-3 block">Idioma de la interfaz</label>
                        <Select
                            className="max-w-xs"
                            placeholder="Select an language"
                            selectedKeys={[language]}
                            variant="bordered"
                            onChange={handlerLanguage}
                            aria-label="d"
                        >
                            {supportedLanguages.map((country) => (
                                <SelectItem key={country.code}
                                    startContent={
                                        <Avatar alt={country.name} className="w-6 h-6" src={country.flag} />
                                    }>
                                    {country.name}
                                </SelectItem>
                            ))}
                        </Select>
                        <p className="text-xs text-default-500 mt-2">Los cambios se aplicarán después de recargar la página</p>
                    </div>
                </CardBody>
            </Card>

            {/* Apariencia */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-default-200 dark:border-default-700 shadow-xl">
                <CardHeader className="pb-3">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        Apariencia
                    </h2>
                </CardHeader>
                <CardBody className="pt-0 space-y-6">
                    <div>
                        <label className="text-sm font-medium text-foreground mb-4 block">Tema del sistema</label>
                        <RadioGroup
                            value={theme}
                            onValueChange={setThemePage}
                            orientation="horizontal"
                            classNames={{ wrapper: "gap-6" }}
                        >
                            <Radio value="light" classNames={{ wrapper: "mr-3" }}>
                                <div className="flex items-center gap-2">
                                    <Sun className="w-4 h-4" />
                                    <span className="font-medium">Claro</span>
                                </div>
                            </Radio>
                            <Radio value="dark" classNames={{ wrapper: "mr-3" }}>
                                <div className="flex items-center gap-2">
                                    <Moon className="w-4 h-4" />
                                    <span className="font-medium">Oscuro</span>
                                </div>
                            </Radio>
                            <Radio value="system" classNames={{ wrapper: "mr-3" }}>
                                <div className="flex items-center gap-2">
                                    <Monitor className="w-4 h-4" />
                                    <span className="font-medium">Sistema</span>
                                </div>
                            </Radio>
                        </RadioGroup>
                    </div>

                    <Divider />

                </CardBody>
            </Card>
        </div>
    )
}

export default Preferences