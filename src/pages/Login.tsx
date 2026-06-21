import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Building2, KeyRound, Mail, ArrowRight, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("admin@aethel.com")
  const [password, setPassword] = useState("••••••••")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Mock login delay
    setTimeout(() => {
      setIsLoading(false)
      navigate("/dashboard")
    }, 800)
  }

  return (
    <div className="flex min-h-screen w-screen bg-background overflow-hidden select-none">
      {/* Left panel: Modern SaaS brand illustration/features */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-zinc-950 text-white overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Aethel EBMS
          </span>
        </div>

        {/* Big SaaS Graphic Mockup */}
        <div className="relative flex-1 flex flex-col justify-center max-w-lg mx-auto z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              Unified Enterprise Management Platform.
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Streamline operations, automate attendance, coordinate projects, and oversee HR operations in one integrated SaaS portal designed for modern business workflows.
            </p>
          </div>

          {/* Floating UI Widget Mockup */}
          <div className="glass-panel p-5 rounded-2xl border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="text-[11px] text-zinc-500 font-mono ml-2">enterprise_analytics.json</span>
            </div>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-xs text-zinc-300">Present Employees Today</span>
                <span className="text-xs font-bold text-primary">94.8%</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-xs text-zinc-300">Active Campaign ROI</span>
                <span className="text-xs font-bold text-emerald-400">+18.4%</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-xs text-zinc-300">Monthly Revenue Stream</span>
                <span className="text-xs font-bold text-purple-400">$124.9k</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 text-xs text-zinc-500">
          © {new Date().getFullYear()} Aethel Tech. All rights reserved.
        </div>
      </div>

      {/* Right panel: Clean central sign-in form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-background relative">
        {/* Mobile top brand banner */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Aethel EBMS
          </span>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2.5">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Welcome Back
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in with your administrator credentials to access your management dashboard.
            </p>
          </div>

          <Card className="border-border/60 bg-card shadow-lg md:shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      required
                      placeholder="admin@aethel.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 h-10.5 rounded-lg border-border/80 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      Password
                    </label>
                    <a href="#forgot" className="text-xs text-primary hover:underline font-medium">
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-10 h-10.5 rounded-lg border-border/80 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Option */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    defaultChecked
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                  />
                  <label htmlFor="remember" className="text-xs text-muted-foreground select-none cursor-pointer">
                    Remember my device for 30 days
                  </label>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full h-11 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 mt-2 flex items-center justify-center gap-2 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Enter Dashboard</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Admin Access Hint */}
          <div className="text-center bg-muted/30 border border-border/40 p-3.5 rounded-xl">
            <p className="text-xs text-muted-foreground leading-normal">
              <span className="font-semibold text-foreground">Tip:</span> This is a frontend demo application. You can press the button above with any mock data to log in instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
