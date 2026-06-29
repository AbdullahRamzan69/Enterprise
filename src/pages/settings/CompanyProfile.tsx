import { useState } from "react"
import { Building2, Save, Globe, Mail, Phone, MapPin, Clock, DollarSign, Upload } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { selectCompanyProfile } from "@/features/settings/settingsSelectors"
import { updateCompanyProfile } from "@/features/settings/settingsSlice"

export default function CompanyProfile() {
  const dispatch = useAppDispatch()
  const profile = useAppSelector(selectCompanyProfile)

  const [formData, setFormData] = useState(profile)
  const [logoPreview, setLogoPreview] = useState(profile.logo)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setLogoPreview(base64)
        setFormData((prev) => ({ ...prev, logo: base64 }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    dispatch(updateCompanyProfile(formData))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Company Profile</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your organization's basic information and contact details.
        </p>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <CardTitle className="text-base font-bold text-foreground">Company Information</CardTitle>
          <CardDescription className="text-xs">
            Update your company's public-facing information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          
          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Company Logo
            </label>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border/60 bg-muted/10 flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-8 h-8 text-muted-foreground/50" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <label htmlFor="logo-upload">
                    <Button size="sm" variant="outline" className="text-xs rounded-lg cursor-pointer">
                      <Upload className="w-3 h-3 mr-1.5" />
                      Upload Logo
                    </Button>
                  </label>
                  {logoPreview && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setLogoPreview("")
                        setFormData((prev) => ({ ...prev, logo: "" }))
                      }}
                      className="text-xs rounded-lg"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Recommended: Square image, max 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Company Name
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter company name"
                className="bg-muted/10 border-border/80 rounded-lg text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@company.com"
                  className="pl-9 bg-muted/10 border-border/80 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="pl-9 bg-muted/10 border-border/80 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className="pl-9 bg-muted/10 border-border/80 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Innovation Drive"
                className="pl-9 bg-muted/10 border-border/80 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                City
              </label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="San Francisco"
                className="bg-muted/10 border-border/80 rounded-lg text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Country
              </label>
              <Input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="United States"
                className="bg-muted/10 border-border/80 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Regional Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Time Zone
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  name="timeZone"
                  value={formData.timeZone}
                  onChange={handleChange}
                  placeholder="America/Los_Angeles"
                  className="pl-9 bg-muted/10 border-border/80 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Currency
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  placeholder="USD"
                  className="pl-9 bg-muted/10 border-border/80 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end pt-4 border-t border-border/50">
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
