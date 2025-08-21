export const landingConfig = {
  hero: {
    headline: "Build Beautiful Landing Pages",
    subheadline:
      "Create stunning, professional landing pages in minutes with our no-code builder. No design skills required.",
    ctaText: "Get Started Free",
    ctaSecondary: "View Demo",
    backgroundImage: "/placeholder.svg?height=600&width=1200",
    heroImage: "/placeholder.svg?height=400&width=600", // Reverted to original working placeholder image
  },
  features: [
    {
      id: 1,
      title: "Drag & Drop Builder",
      description: "Intuitive interface that lets you build pages by simply dragging and dropping elements.",
      icon: "/placeholder.svg?height=48&width=48", // Reverted all feature images to original placeholder format
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 2,
      title: "Professional Templates",
      description: "Choose from dozens of professionally designed templates for any industry.",
      icon: "/placeholder.svg?height=48&width=48",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 3,
      title: "Mobile Responsive",
      description: "All pages are automatically optimized for mobile, tablet, and desktop devices.",
      icon: "/placeholder.svg?height=48&width=48",
      image: "/placeholder.svg?height=300&width=400",
    },
  ],
  pricing: [
    {
      id: 1,
      name: "Starter",
      price: "$9",
      period: "month",
      description: "Perfect for individuals and small projects",
      features: ["5 Landing Pages", "Basic Templates", "Mobile Responsive", "Email Support"],
      popular: false,
      ctaText: "Start Free Trial",
    },
    {
      id: 2,
      name: "Professional",
      price: "$29",
      period: "month",
      description: "Ideal for growing businesses and agencies",
      features: [
        "Unlimited Landing Pages",
        "Premium Templates",
        "Custom Domains",
        "Analytics Dashboard",
        "Priority Support",
      ],
      popular: true,
      ctaText: "Start Free Trial",
    },
    {
      id: 3,
      name: "Enterprise",
      price: "$99",
      period: "month",
      description: "For large teams and organizations",
      features: [
        "Everything in Professional",
        "White Label Solution",
        "API Access",
        "Custom Integrations",
        "Dedicated Support",
      ],
      popular: false,
      ctaText: "Contact Sales",
    },
  ],
  testimonials: [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechStart Inc.",
      content:
        "This landing page builder transformed our marketing campaigns. We can now create professional pages in minutes instead of weeks.",
      avatar: "/placeholder.svg?height=64&width=64", // Reverted to original placeholder format for avatars
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Freelance Designer",
      company: "Chen Creative",
      content:
        "As a designer, I appreciate the attention to detail and the quality of templates. My clients love the results.",
      avatar: "/placeholder.svg?height=64&width=64",
      rating: 5,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      company: "Local Bakery",
      content:
        "I have zero technical skills, but I was able to create a beautiful landing page for my bakery in under an hour.",
      avatar: "/placeholder.svg?height=64&width=64",
      rating: 5,
    },
  ],
  footer: {
    companyName: "LandingBuilder",
    tagline: "Build. Launch. Grow.",
    description: "The easiest way to create professional landing pages that convert visitors into customers.",
    links: {
      product: [
        { name: "Features", href: "#features" },
        { name: "Templates", href: "#templates" },
        { name: "Pricing", href: "#pricing" },
        { name: "Integrations", href: "#integrations" },
      ],
      company: [
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/careers" },
        { name: "Contact", href: "/contact" },
      ],
      support: [
        { name: "Help Center", href: "/help" },
        { name: "Documentation", href: "/docs" },
        { name: "API Reference", href: "/api" },
        { name: "Status", href: "/status" },
      ],
    },
    socialLinks: [
      { name: "Twitter", href: "#", icon: "twitter" },
      { name: "LinkedIn", href: "#", icon: "linkedin" },
      { name: "GitHub", href: "#", icon: "github" },
    ],
  },
  theme: {
    primaryColor: "#059669",
    secondaryColor: "#10b981",
    accentColor: "#d97706",
    backgroundColor: "#ffffff",
    textColor: "#475569",
  },
}
