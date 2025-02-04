import React from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "../hooks/useToast";
import { useFormValidation } from "../hooks/useFormValidation";
import { LoadingOverlay } from "../components/ui/LoadingStates/LoadingOverlay";
import { FormField } from "../components/ui/Form/FormField";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const ContactPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const validationSchema = {
    name: (value) => {
      if (!value) return "Name is required";
      if (value.length < 2) return "Name must be at least 2 characters";
      return "";
    },
    email: (value) => {
      if (!value) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Invalid email address";
      return "";
    },
    phone: (value) => {
      if (!value) return "Phone is required";
      if (!/^\+?[\d\s-]{10,}$/.test(value)) return "Invalid phone number";
      return "";
    },
    message: (value) => {
      if (!value) return "Message is required";
      if (value.length < 10) return "Message must be at least 10 characters";
      return "";
    },
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  } = useFormValidation(
    {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    validationSchema
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast({
        title: "Validation Error",
        description: "Please check your inputs and try again.",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      addToast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
        variant: "success",
      });

      resetForm();
      navigate("/");
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600">
          Get in touch with us for any questions about our services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Phone</h3>
            <a href="tel:4237483508" className="text-primary hover:underline">
              423 748 3508
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Email</h3>
            <a
              href="mailto:admin@caringheartandhand.com"
              className="text-primary hover:underline"
            >
              admin@caringheartandhand.com
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Address</h3>
            <span className="text-gray-600">125 Business Address</span>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Send us a Message
          </h2>

          <LoadingOverlay isLoading={isSubmitting}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                label="Name"
                error={touched.name && errors.name}
                required
              >
                <Input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your name"
                />
              </FormField>

              <FormField
                label="Email"
                error={touched.email && errors.email}
                required
              >
                <Input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="your.email@example.com"
                />
              </FormField>

              <FormField
                label="Phone"
                error={touched.phone && errors.phone}
                required
              >
                <Input
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your phone number"
                />
              </FormField>

              <FormField
                label="Message"
                error={touched.message && errors.message}
                required
              >
                <Textarea
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="How can we help you?"
                  rows={5}
                />
              </FormField>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </LoadingOverlay>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPage;
