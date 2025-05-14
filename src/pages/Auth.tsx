import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  LockKeyhole, 
  Mail, 
  User, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion } from 'framer-motion';

interface AuthFormValues {
  email: string;
  password: string;
  confirmPassword?: string;
  role?: string;
  name?: string;
}

const Auth = () => {
  const { signIn, signUp, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/auth/login';
  const defaultTab = isLoginPage ? 'login' : 'register';
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);


  const loginForm = useForm<AuthFormValues>();
  const registerForm = useForm<AuthFormValues>({
    defaultValues: {
      role: 'student'
    },
    mode: 'onChange'
  });
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onLoginSubmit = async (data: AuthFormValues) => {
    await signIn(data.email, data.password);
  };

  const onRegisterSubmit = async (data: AuthFormValues) => {
    if (data.password !== data.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    setPasswordMatch(true);
    await signUp(data.email, data.password, data.name, data.role);
  };

  const handleTabChange = (value) => {
    if (value === 'login') {
      navigate('/auth/login', { replace: true });
    } else {
      navigate('/auth/register', { replace: true });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const logoVariants = {
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, -5, 0],
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="flex items-center gap-3 mb-10"
        variants={logoVariants}
        whileHover="hover"
      >
        <BookOpen className="h-10 w-10 text-purple-600" />
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          Decode COA Notes
        </h1>
      </motion.div>
      
      <motion.div 
        className="w-full max-w-md"
        variants={itemVariants}
      >
        <Card className="shadow-xl border-slate-200 dark:border-slate-700 overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-slate-800/90">
          <Tabs 
            defaultValue={defaultTab} 
            className="w-full"
            onValueChange={handleTabChange}
          >
            <TabsList className="grid w-full grid-cols-2 rounded-none">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-purple-600 transition-all duration-300 py-3"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-purple-600 transition-all duration-300 py-3"
              >
                Create Account
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="animate-in slide-in-from-left duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to access your saved bookmarks and notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={loginForm.control}
                        name="email"
                        rules={{ 
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                                <Input 
                                  placeholder="your.email@example.com" 
                                  className="pl-10 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" 
                                  type="email"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={loginForm.control}
                        name="password"
                        rules={{ required: "Password is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center">
                              <FormLabel>Password</FormLabel>
                             <Link
  to="#"
  onClick={(e) => {
    e.preventDefault();
    setShowForgotModal(true);
  }}
  className="text-xs text-purple-600 hover:text-purple-800 transition-colors"
>
  Forgot password?
</Link>
                            </div>
                            <FormControl>
                              <div className="relative group">
                                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                                <Input 
                                  placeholder="••••••••" 
                                  type="password" 
                                  className="pl-10 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Button 
                        type="submit" 
                        className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 py-6 transition-all transform active:scale-95 duration-200" 
                        disabled={loading}
                      >
                        {loading ? "Signing in..." : "Sign in"} 
                        {!loading && <ArrowRight className="h-4 w-4 animate-bounce-x" />}
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-slate-200 dark:border-slate-700 py-4">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/auth/register" className="text-purple-600 hover:text-purple-800 font-medium hover:underline transition-colors">
                    Create one now
                  </Link>
                </p>
              </CardFooter>
            </TabsContent>
            {showForgotModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg max-w-md w-full">
      <h2 className="text-lg font-semibold mb-2 text-purple-600">Forgot Password</h2>
      <p className="text-sm text-gray-700 dark:text-gray-200">
        Please contact admin at <a href="mailto:decodecoahelp@gmail.com" className="text-purple-600 underline">decodecoahelp@gmail.com</a> to reset your password.
      </p>
      <div className="mt-4 flex justify-end">
        <Button onClick={() => setShowForgotModal(false)} className="bg-purple-600 text-white hover:bg-purple-700">
          Close
        </Button>
      </div>
    </div>
  </div>
)}
            <TabsContent value="register" className="animate-in slide-in-from-right duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>
                  Join Decode COA Notes to access and share study materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={registerForm.control}
                        name="email"
                        rules={{ 
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                                <Input 
                                  placeholder="your.email@example.com" 
                                  className="pl-10 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" 
                                  type="email"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={registerForm.control}
                        name="name"
                        rules={{ required: "Full name is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                                <Input 
                                  placeholder="John Smith" 
                                  className="pl-10 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={registerForm.control}
                        name="role"
                        rules={{ required: "Role is required" }}
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>I am a</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-2"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-slate-200 dark:border-slate-700 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                  <FormControl>
                                    <RadioGroupItem value="student" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-purple-600" />
                                    Student
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-slate-200 dark:border-slate-700 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                  <FormControl>
                                    <RadioGroupItem value="teacher" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-purple-600" />
                                    Teacher/Professor
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={registerForm.control}
                        name="password"
                        rules={{ 
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters"
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
                            message: "Password must contain uppercase, lowercase and number"
                          }
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                                <Input 
                                  placeholder="••••••••" 
                                  type="password" 
                                  className="pl-10 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        rules={{ 
                          required: "Please confirm your password",
                          validate: (value) => {
                            const { password } = registerForm.getValues();
                            return password === value || "Passwords do not match";
                          }
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <CheckCircle2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                                <Input 
                                  placeholder="••••••••" 
                                  type="password" 
                                  className="pl-10 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                            {!passwordMatch && (
                              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> Passwords do not match
                              </p>
                            )}
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Button 
                        type="submit" 
                        className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 py-6 transition-all transform active:scale-95 duration-200" 
                        disabled={loading}
                      >
                        {loading ? "Creating account..." : "Create account"} 
                        {!loading && <ArrowRight className="h-4 w-4 animate-bounce-x" />}
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-slate-200 dark:border-slate-700 py-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/auth/login" className="text-purple-600 hover:text-purple-800 font-medium hover:underline transition-colors">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
      
      <motion.div 
        className="mt-8 text-center text-sm text-muted-foreground"
        variants={itemVariants}
      >
        <p>By creating an account, you agree to our <Link to="/terms" className="text-purple-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link></p>
        <div className="mt-4 flex justify-center gap-4">
          <a 
            href="https://www.decodecoa.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
          >
            <BookOpen className="h-4 w-4" />
            Visit main website
          </a>
          <Link
            to="/support"
            className="text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
          >
            <Mail className="h-4 w-4" />
            Contact support
          </Link>
        </div>
      </motion.div>
      
      {/* Add custom style for animation */}
      <style jsx>{`
        @keyframes bounce-x {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default Auth;