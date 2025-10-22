import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { toast } from "sonner@2.0.3";
import { 
  Shield, 
  Mail, 
  Lock, 
  KeyRound, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Send,
  RefreshCw
} from "lucide-react";

interface PasswordResetProps {
  onClose: () => void;
  userRole?: string;
}

type ResetStep = "request" | "verify" | "reset" | "success";

export function PasswordReset({ onClose, userRole }: PasswordResetProps) {
  const [currentStep, setCurrentStep] = useState<ResetStep>("request");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [resetData, setResetData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSendResetCode = async () => {
    if (!resetData.email) {
      toast.error("Ingrese su correo electrónico");
      return;
    }

    setIsLoading(true);
    try {
      // Simular envío de código
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep("verify");
      toast.success("Código de verificación enviado a su correo");
    } catch (error) {
      toast.error("Error al enviar el código");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!resetData.verificationCode || resetData.verificationCode.length !== 6) {
      toast.error("Ingrese el código de 6 dígitos");
      return;
    }

    setIsLoading(true);
    try {
      // Simular verificación de código
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep("reset");
      toast.success("Código verificado correctamente");
    } catch (error) {
      toast.error("Código incorrecto o expirado");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetData.newPassword || resetData.newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (resetData.newPassword !== resetData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    try {
      // Simular cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep("success");
      toast.success("Contraseña actualizada exitosamente");
    } catch (error) {
      toast.error("Error al actualizar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    toast.success("Nuevo código enviado");
  };

  const getStepProgress = () => {
    const steps = ["request", "verify", "reset", "success"];
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restablecer Contraseña</h1>
          <p className="text-gray-600">Sistema SIREST - Globatech S.A.S</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Solicitar</span>
            <span>Verificar</span>
            <span>Cambiar</span>
            <span>Completado</span>
          </div>
        </div>

        {/* Paso 1: Solicitar código */}
        {currentStep === "request" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>Solicitar Código de Restablecimiento</span>
              </CardTitle>
              <CardDescription>
                Ingrese su correo electrónico para recibir un código de verificación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={resetData.email}
                  onChange={(e) => setResetData({...resetData, email: e.target.value})}
                  placeholder="usuario@globatech.com"
                  className="bg-gray-50"
                />
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Se enviará un código de 6 dígitos a su correo electrónico. 
                  El código será válido por 15 minutos.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={handleSendResetCode} 
                  disabled={isLoading || !resetData.email}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Código
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={onClose} className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Login
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Paso 2: Verificar código */}
        {currentStep === "verify" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <KeyRound className="h-5 w-5 text-blue-600" />
                <span>Verificar Código</span>
              </CardTitle>
              <CardDescription>
                Ingrese el código de 6 dígitos enviado a {resetData.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Código de Verificación</Label>
                <Input
                  id="verificationCode"
                  value={resetData.verificationCode}
                  onChange={(e) => setResetData({...resetData, verificationCode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                  placeholder="123456"
                  className="text-center text-2xl tracking-widest font-mono bg-gray-50"
                  maxLength={6}
                />
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">¿No recibiste el código?</p>
                <Button variant="link" onClick={handleResendCode} className="text-blue-600">
                  Reenviar código
                </Button>
              </div>

              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  El código expira en 15 minutos. Revise su bandeja de entrada y spam.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={handleVerifyCode} 
                  disabled={isLoading || resetData.verificationCode.length !== 6}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verificar Código
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={() => setCurrentStep("request")} className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cambiar Email
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Paso 3: Nueva contraseña */}
        {currentStep === "reset" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-blue-600" />
                <span>Nueva Contraseña</span>
              </CardTitle>
              <CardDescription>
                Ingrese su nueva contraseña segura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={resetData.newPassword}
                    onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                    placeholder="Ingrese su nueva contraseña"
                    className="bg-gray-50 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={resetData.confirmPassword}
                    onChange={(e) => setResetData({...resetData, confirmPassword: e.target.value})}
                    placeholder="Confirme su nueva contraseña"
                    className="bg-gray-50 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Requisitos de contraseña:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className={`flex items-center space-x-2 ${resetData.newPassword.length >= 6 ? 'text-green-700' : ''}`}>
                    <CheckCircle className={`h-3 w-3 ${resetData.newPassword.length >= 6 ? 'text-green-600' : 'text-gray-400'}`} />
                    <span>Mínimo 6 caracteres</span>
                  </li>
                  <li className={`flex items-center space-x-2 ${resetData.newPassword === resetData.confirmPassword && resetData.newPassword ? 'text-green-700' : ''}`}>
                    <CheckCircle className={`h-3 w-3 ${resetData.newPassword === resetData.confirmPassword && resetData.newPassword ? 'text-green-600' : 'text-gray-400'}`} />
                    <span>Las contraseñas coinciden</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={handleResetPassword} 
                  disabled={isLoading || !resetData.newPassword || resetData.newPassword !== resetData.confirmPassword}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Actualizar Contraseña
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={() => setCurrentStep("verify")} className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Verificar Código Nuevamente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Paso 4: Éxito */}
        {currentStep === "success" && (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-green-900">¡Contraseña Actualizada!</CardTitle>
              <CardDescription>
                Su contraseña ha sido restablecida exitosamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Siguiente paso:</h4>
                <p className="text-sm text-green-700">
                  Ahora puede iniciar sesión con su nueva contraseña. 
                  Por seguridad, se cerrarán todas las sesiones activas.
                </p>
              </div>

              <div className="space-y-3">
                <Button onClick={onClose} className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Ir al Login
                </Button>
                
                <div className="text-center">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Restablecimiento completado: {new Date().toLocaleString('es-ES')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}