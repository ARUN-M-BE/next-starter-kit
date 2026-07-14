import { PageHeader } from "@/components/shared/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5 text-primary" />,
      title: "Email Support",
      value: "support@yourdomain.com",
      description: "Response within 24 hours",
    },
    {
      icon: <Phone className="h-5 w-5 text-primary" />,
      title: "Phone Support",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri from 9am to 6pm",
    },
    {
      icon: <MapPin className="h-5 w-5 text-primary" />,
      title: "Office Location",
      value: "100 Innovation Way, Suite 400",
      description: "San Francisco, CA 94107",
    },
    {
      icon: <Clock className="h-5 w-5 text-primary" />,
      title: "Business Hours",
      value: "9:00 AM - 6:00 PM PST",
      description: "Closed on public holidays",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12 text-left">
        <PageHeader
          title="Contact Us"
          description="Send an email dispatch utilizing Nodemailer SMTP relays or Resend API integrations."
          breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Contact" }]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Contact form - LHS */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Details - RHS */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-border/60 shadow-sm bg-card">
              <CardContent className="p-6 space-y-6">
                <div className="text-left space-y-1">
                  <h3 className="text-lg font-bold">Contact Details</h3>
                  <p className="text-xs text-muted-foreground">
                    Direct integration points for transactional and notification emails.
                  </p>
                </div>

                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex space-x-3 text-left">
                      <div className="h-9 w-9 bg-muted rounded-xl flex items-center justify-center shrink-0">
                        {info.icon}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">{info.title}</p>
                        <p className="text-sm font-bold text-foreground truncate">{info.value}</p>
                        <p className="text-xs text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
