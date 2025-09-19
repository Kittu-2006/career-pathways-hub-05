import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Users, Building2 } from "lucide-react";
import heroImage from "@/assets/hero-internship.jpg";
import { UserRole } from "@/types/auth";

interface LoginPageProps {
  onLogin: (email: string, password: string, role: UserRole) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (role: UserRole) => {
    setIsLoading(true);
    // Simulate authentication delay
    setTimeout(() => {
      onLogin(email, password, role);
      setIsLoading(false);
    }, 1000);
  };

  const roleConfig = {
    student: {
      icon: GraduationCap,
      title: "Student Portal",
      description: "Access internships and track your applications",
      bgGradient: "bg-gradient-to-br from-primary to-primary-dark",
    },
    mentor: {
      icon: Users,
      title: "Mentor Panel",
      description: "Review and approve student applications",
      bgGradient: "bg-gradient-to-br from-secondary to-secondary/80",
    },
    placement_cell: {
      icon: Building2,
      title: "Placement Cell",
      description: "Manage internships and view applicants",
      bgGradient: "bg-gradient-to-br from-primary to-secondary",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Students and mentors collaboration"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-secondary/60" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Student Internship Portal
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Connecting students, mentors, and placement cells for seamless internship management
            </p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <Card className="backdrop-blur-sm bg-white/95 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Welcome Back</CardTitle>
            <CardDescription>Choose your role and sign in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-12">
                {Object.entries(roleConfig).map(([role, config]) => {
                  const Icon = config.icon;
                  return (
                    <TabsTrigger
                      key={role}
                      value={role}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <Icon className="h-4 w-4" />
                      {config.title.split(" ")[0]}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.entries(roleConfig).map(([role, config]) => {
                const Icon = config.icon;
                return (
                  <TabsContent key={role} value={role} className="mt-6">
                    <div className={`${config.bgGradient} p-6 rounded-lg mb-6`}>
                      <div className="flex items-center gap-3 text-white">
                        <Icon className="h-8 w-8" />
                        <div>
                          <h3 className="text-xl font-semibold">{config.title}</h3>
                          <p className="text-white/90">{config.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`email-${role}`}>Email Address</Label>
                        <Input
                          id={`email-${role}`}
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`password-${role}`}>Password</Label>
                        <Input
                          id={`password-${role}`}
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12"
                        />
                      </div>

                      <Button
                        onClick={() => handleSubmit(role as UserRole)}
                        disabled={!email || !password || isLoading}
                        className="w-full h-12 text-lg font-semibold"
                      >
                        {isLoading ? "Signing In..." : `Sign In as ${config.title.split(" ")[0]}`}
                      </Button>

                      <div className="text-center text-sm text-muted-foreground">
                        Demo Credentials: Use any email/password combination
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="py-12"></div>
    </div>
  );
}