import React from "react"
import { Layout } from "../../components/layout/Layout"
import Seo from "@/components/ui/Seo"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/ScrollAnimation"
import { Target, Image, Monitor, FileText, Search, Users, Mail, Megaphone, Calculator, Home, BookOpen, ShieldCheck, Globe, Share2, MessageSquare, Handshake, BadgeDollarSign } from "lucide-react"

const Marketing = () => {
    const services = [
        { title: "Brand strategy and positioning", icon: Target },
        { title: "Branding & logo design", icon: Image },
        { title: "Website development and optimisation", icon: Monitor },
        { title: "Content and copywriting", icon: FileText },
        { title: "SEO & AEO", icon: Search },
        { title: "Social media management", icon: Users },
        { title: "Email marketing", icon: Mail },
        { title: "Paid advertising", icon: Megaphone },
    ]
    return (
        <Layout>
            <Seo
                title="Expert Paraplanning Services for Financial Advisers"
                description="Professional paraplanning support: SOA preparation, client file management, compliance documentation & portfolio reviews. Scale your practice with our experts."
                keywords="paraplanning services, statement of advice preparation, financial planning support, client file management, portfolio review services, compliance documentation, SOA preparation, financial adviser support, paraplanning outsourcing"
                pathname="/services/paraplanning"
                schemaData={{
                    "@type": "LocalBusiness",
                    name: "Advice Lab Paraplanning Services",
                    description:
                        "Expert paraplanning services for financial advisers including SOA preparation and compliance documentation",
                    url: "https://advicelab.com.au/services/paraplanning",
                }}
            />

            <section className="py-24 gradient-primary">
                <div className="container mx-auto px-4 lg:px-8 flex justify-center">
                    <ScrollAnimation animation="fade-up" className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-6"></div>
                        <h1 className="text-4xl text-center md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
                            Digital Marketing
                        </h1>

                        {/* Tagline */}
                        <p className="text-xl text-primary-foreground/80 mb-8 text-center">
                            Build trust at every client touchpoint.
                            We help advisers, accountants, and brokers communicate their value with confidence.
                        </p>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-14">

                            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                <Users className="w-6 h-6 mx-auto mb-3 text-primary-foreground" />
                                <p className="text-sm text-primary-foreground text-center">
                                    Financial Advisers Accountants & Brokers
                                </p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                <ShieldCheck className="w-6 h-6 mx-auto mb-3 text-primary-foreground" />
                                <p className="text-sm text-primary-foreground text-center">
                                    Trust-First Compliant Marketing
                                </p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                <BadgeDollarSign className="w-6 h-6 mx-auto mb-3 text-primary-foreground" />
                                <p className="text-sm text-primary-foreground text-center">
                                    No Hidden Markups
                                </p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                <Handshake className="w-6 h-6 mx-auto mb-3 text-primary-foreground" />
                                <p className="text-sm text-primary-foreground text-center">
                                    No Lock-In Commitments
                                </p>
                            </div>

                        </div>
                    </ScrollAnimation>
                </div>
            </section>

            {/* second section */}
            <section className="py-20 bg-surface">
                <ScrollAnimation animation="fade-up">

                    <div className="max-w-4xl mx-auto text-center">

                        <h1 className="font-display font-semibold text-4xl text-center md:text-5xl lg:text-6xl font-display font-bold text-muted-foreground mb-6">
                            Let your {" "}
                            <span className="gradient-primary bg-clip-text text-transparent font-semibold">
                                digital handshake
                            </span>{" "}
                            tell your story before the first conversation.
                        </h1>

                        {/* Tagline */}
                        {/* <p className="text-lg md:text-xl text-muted-foreground/80 max-w-3xl mx-auto mb-10">
                            For financial advisers, accountants, and mortgage
                            brokers, trust starts long before the first meeting.
                            We help shape your brand story, modernise your
                            digital presence, and communicate your value clearly
                            across every client touchpoint.
                        </p> */}
                        {/* <h2 className="text-4xl text-center md:text-5xl font-display font-semibold ">
                            Let your digital handshake tell your story before the first conversation.
                        </h2>
                        <p className="text-muted-foreground/70 mt-4"></p> */}

                        {/* CTA */}
                        <Button
                            variant="white"
                            size="lg"
                            className="px-8"
                        >
                            Take Your Free Strategy Audit
                        </Button>

                    </div>

                </ScrollAnimation>
            </section>

            {/* Services We Provide */}
            <section className="">
                <div className="container mx-auto px-4 lg:px-8">
                    <ScrollAnimation animation="fade-up">
                        <div className="text-center mb-8">
                            <h2 className="font-display font-bold mt-2 mb-6 text-foreground text-2xl md:text-3xl">Services We Provide</h2>
                            <p className="text-muted-foreground/70 mt-2">We help across brand, website, content and growth channels.</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {services.map((s, index) => {
                                const Icon = s.icon

                                const isWhiteIcon = [0, 2, 5, 7].includes(index) // 1,3,6,8

                                return (
                                    <ScrollAnimation
                                        key={s.title}
                                        animation="fade-up"
                                        delay={index * 100}
                                    >
                                        <div className="group cursor-pointer p-6 bg-card rounded-3xl border border-border hover:border-primary/30 hover-lift transition-all duration-300 hover:shadow-xl">

                                            <div
                                                className="w-12 h-12 mx-auto flex items-center justify-center mb-6 transition-all duration-300 "
                                            >

                                                <Icon
                                                    className="w-6 h-6 text-muted-foreground"
                                                />

                                            </div>

                                            <h3 className="text-sm font-bold text-center group-hover:text-primary transition-colors duration-300">
                                                {s.title}
                                            </h3>

                                        </div>
                                    </ScrollAnimation>
                                )
                            })}
                        </div>
                    </ScrollAnimation>
                </div>
            </section>


            {/* Built for Trust-Led Professional Practices */}
            <section className="py-20 bg-surface">
                <div className="container mx-auto px-4 lg:px-8">
                    <ScrollAnimation animation="fade-up">
                        <div className="text-center mb-8">
                            <h2 className="font-display font-bold mt-2 mb-6 text-foreground text-2xl md:text-3xl">
                                Built for Trust Led Professional Practices
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Communicate value and build long-term client relationships across
                                professional practices.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* Financial Advisers */}
                            <div className="group border border-border rounded-lg p-6 bg-card cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-md bg-white/5 transition-all duration-300">
                                        <Users className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                                            Financial Advisers
                                        </h3>

                                        <p className="text-muted-foreground mb-8">
                                            Communicate your expertise, process and value to attract
                                            clients and strengthen long-term relationships.
                                        </p>

                                        {/* <a className="inline-block text-sm text-muted-foreground/90 hover:text-primary transition-colors"
                                            href="#"
                                        >
                                            Learn more →
                                        </a> */}
                                    </div>
                                </div>
                            </div>

                            {/* Accountants */}
                            <div className="group border border-border rounded-lg p-6 bg-card cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-md bg-white/5 transition-all duration-300 ">
                                        <Calculator className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                                            Accountants
                                        </h3>

                                        <p className="text-muted-foreground mb-8">
                                            Showcase reliability, industry expertise and proactive advice
                                            that keeps clients coming back.
                                        </p>

                                        {/* <a className="inline-block text-sm text-muted-foreground/90 hover:text-primary transition-colors"
                                            href="#"
                                        >
                                            Learn more →
                                        </a> */}
                                    </div>
                                </div>
                            </div>

                            {/* Mortgage Brokers */}
                            <div className="group border border-border rounded-lg p-6 bg-card cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-md bg-white/5 transition-all duration-300">
                                        <Home className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                                            Mortgage Brokers
                                        </h3>

                                        <p className="text-muted-foreground mb-8">
                                            Build confidence with borrowers and referral partners through
                                            clarity, credibility and consistent visibility.
                                        </p>

                                        {/* <a className="inline-block text-sm text-muted-foreground/90 hover:text-primary transition-colors"
                                            href="#"
                                        >
                                            Learn more →
                                        </a> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>
            </section>

            {/* Your next client is already searching for you. */}
            <section className="py-20 gradient-primary">
                <div className="container mx-auto px-4 lg:px-8">
                    <ScrollAnimation animation="fade-up" className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-display font-semibold text-primary-foreground">Don’t Let Your Reputation Go Unseen</h2>
                        <p className="text-primary-foreground/80 mt-4">Your best prospects are already researching online. Make sure the digital version of your practice is as credible as the real one.</p>
                    </ScrollAnimation>
                </div>
            </section>


            {/* What Your Digital Presence Should Do */}
            <section className="py-16">
                <div className="container mx-auto px-4 lg:px-8">
                    <ScrollAnimation animation="fade-up">
                        <div className="text-center mb-8">
                            <h2 className="font-display font-bold mt-2 mb-6 text-foreground text-2xl md:text-3xl">
                                What your Digital Presence Should do
                            </h2>
                            <p className="text-muted-foreground/70 mt-2">
                                Clear actions your website and content should deliver to grow your
                                practice.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                            {/* Tell Your Brand Story */}
                            <div className="group border border-border rounded-lg p-6 bg-card cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30">
                                <div className="flex items-start gap-4">

                                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-soft border border-white/10">
                                        <BookOpen className="w-7 h-7 text-muted-foreground" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                                            Tell Your Brand Story
                                        </h3>

                                        <p className="text-muted-foreground mb-8">
                                            Clearly showcase your purpose, values and positioning so your
                                            brand connects with your audience.
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Build Trust */}
                            <div className="group border border-border rounded-lg p-6 bg-card cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30">
                                <div className="flex items-start gap-4">

                                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-soft border border-white/10">
                                        <ShieldCheck className="w-7 h-7 text-muted-foreground" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                                            Build Trust
                                        </h3>

                                        <p className="text-muted-foreground mb-8">
                                            Show credibility with proof and professionalism.
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Improve Visibility */}
                            <div className="group border border-border rounded-lg p-6 bg-card cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30">
                                <div className="flex items-start gap-4">

                                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-soft border border-white/10">
                                        <Globe className="w-7 h-7 text-muted-foreground" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                                            Improve Visibility
                                        </h3>

                                        <p className="text-muted-foreground mb-8">
                                            Be found by clients on search engines and AI.
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Strengthen Referrals */}
                            <div className="group border border-border rounded-lg p-6 bg-card cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30">
                                <div className="flex items-start gap-4">

                                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-soft border border-white/10">

                                        <Share2 className="w-7 h-7 text-muted-foreground" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                                            Strengthen Referrals
                                        </h3>

                                        <p className="text-muted-foreground mb-8">
                                            Make it easy for clients to recommend you.
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Clarify Services */}
                            <div className="group border border-border rounded-lg p-6 bg-card cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30">
                                <div className="flex items-start gap-4">

                                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-soft border border-white/10">

                                        <FileText className="w-7 h-7 text-muted-foreground" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                                            Clarify Services
                                        </h3>

                                        <p className="text-muted-foreground mb-8">
                                            Help clients understand how you help.
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Drive Enquiries */}
                            <div className="group border border-border rounded-lg p-6 bg-card cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30">
                                <div className="flex items-start gap-4">

                                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-soft border border-white/10">

                                        <MessageSquare className="w-7 h-7 text-muted-foreground" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                                            Drive Enquiries
                                        </h3>

                                        <p className="text-muted-foreground mb-8">
                                            Turn interest into meaningful conversations.
                                        </p>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </ScrollAnimation>
                </div>
            </section>
        </Layout>
    )
}

export default Marketing