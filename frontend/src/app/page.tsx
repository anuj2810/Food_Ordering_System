"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="landing-page">
      {/* ===== NAVIGATION BAR ===== */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link href="/" className="landing-logo">
            <div className="landing-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="gradient-text" style={{ fontSize: "1.4rem", fontWeight: 800 }}>FoodOrder</span>
          </Link>
          <div className="landing-nav-links">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#how-it-works" className="landing-nav-link">How It Works</a>
            <a href="#about" className="landing-nav-link">About</a>
          </div>
          <div className="landing-nav-auth">
            <Link href="/login" className="btn-ghost">Log In</Link>
            <Link href="/register" className="btn-primary" style={{ padding: "0.6rem 1.4rem" }}>Sign Up Free</Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-glow hero-glow-3" />

        <div className="hero-content animate-fade-in-up">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Fresh & Fast Delivery Platform
          </div>
          <h1 className="hero-title">
            Order Delicious Food<br />
            <span className="gradient-text">From Your Favorite</span><br />
            Restaurants
          </h1>
          <p className="hero-subtitle">
            Browse menus, add to cart, and get fresh food delivered straight to your door.
            Manage restaurants, track orders, and accept payments — all in one powerful platform.
          </p>
          <div className="hero-cta">
            <Link href="/register" className="btn-primary hero-btn">
              Get Started Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a href="#features" className="btn-secondary hero-btn">
              Learn More
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">100+</span>
              <span className="hero-stat-label">Restaurants</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">10K+</span>
              <span className="hero-stat-label">Orders Delivered</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">4.9★</span>
              <span className="hero-stat-label">User Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2 className="section-title">Everything You Need to<br /><span className="gradient-text">Order & Manage Food</span></h2>
            <p className="section-subtitle">A complete food ordering ecosystem for customers, restaurant managers, and administrators.</p>
          </div>
          <div className="features-grid">
            {[
              { icon: "🍔", title: "Browse & Order", desc: "Explore restaurant menus, add items to your cart, and place orders in seconds." },
              { icon: "📱", title: "Real-Time Tracking", desc: "Track your order status from CREATED ➜ PAID ➜ COMPLETED in real time." },
              { icon: "💳", title: "Secure Payments", desc: "Add and manage multiple payment methods with tokenized security." },
              { icon: "👑", title: "Admin Dashboard", desc: "Full admin control: manage users, restaurants, menu items, and orders." },
              { icon: "🔐", title: "Role-Based Access", desc: "Three roles — Member, Manager, Admin — each with tailored permissions." },
              { icon: "🚀", title: "Lightning Fast", desc: "Built with Next.js, GraphQL, and NestJS for blazing-fast performance." },
            ].map((f, i) => (
              <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="section section-alt">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">Start Ordering in<br /><span className="gradient-text">3 Simple Steps</span></h2>
          </div>
          <div className="steps-grid">
            {[
              { num: "01", title: "Create Your Account", desc: "Sign up in seconds with your name, email, and preferred role. No credit card required.", icon: "👤" },
              { num: "02", title: "Browse & Add to Cart", desc: "Explore restaurants, view menus with prices, and add your favorite items to the cart.", icon: "🛒" },
              { num: "03", title: "Checkout & Enjoy", desc: "Review your order, place it with one click, and track it until it's delivered to your door.", icon: "🎉" },
            ].map((s, i) => (
              <div key={i} className="step-card">
                <div className="step-num">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
                {i < 2 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT / WHY US ===== */}
      <section id="about" className="section">
        <div className="section-inner">
          <div className="about-grid">
            <div className="about-text">
              <span className="section-tag">Why FoodOrder?</span>
              <h2 className="section-title" style={{ textAlign: "left" }}>Built for Speed,<br />Designed for <span className="gradient-text">Everyone</span></h2>
              <p className="about-desc">
                FoodOrder isn't just another delivery app. It's a full-stack platform that connects hungry customers
                with amazing restaurants while giving admins complete control over the ecosystem.
              </p>
              <div className="about-highlights">
                {[
                  { label: "GraphQL API", desc: "Type-safe queries with zero over-fetching" },
                  { label: "JWT Security", desc: "Industry-standard token authentication" },
                  { label: "Role Guards", desc: "Granular permissions for every action" },
                  { label: "Docker Ready", desc: "One command to deploy the entire stack" },
                ].map((h, i) => (
                  <div key={i} className="about-highlight">
                    <div className="about-check">✓</div>
                    <div>
                      <strong>{h.label}</strong>
                      <span className="about-highlight-desc">{h.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-visual">
              <div className="about-card-stack">
                <div className="about-card-mock about-card-1">
                  <div className="mock-header">
                    <div className="mock-dot mock-dot-red" />
                    <div className="mock-dot mock-dot-yellow" />
                    <div className="mock-dot mock-dot-green" />
                  </div>
                  <div className="mock-line mock-line-lg" />
                  <div className="mock-line mock-line-md" />
                  <div className="mock-grid">
                    <div className="mock-card-sm" />
                    <div className="mock-card-sm" />
                  </div>
                </div>
                <div className="about-card-mock about-card-2">
                  <div className="mock-header">
                    <div className="mock-dot mock-dot-red" />
                    <div className="mock-dot mock-dot-yellow" />
                    <div className="mock-dot mock-dot-green" />
                  </div>
                  <div className="mock-line mock-line-sm" />
                  <div className="mock-bar" />
                  <div className="mock-bar mock-bar-short" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="cta-glow" />
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Ordering?</h2>
          <p className="cta-subtitle">
            Join thousands of food lovers. Create your free account and experience the best food ordering platform.
          </p>
          <div className="cta-buttons">
            <Link href="/register" className="btn-primary hero-btn">
              Create Your Account
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/login" className="btn-ghost" style={{ fontSize: "1rem" }}>
              Already have an account? Log In →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="landing-logo" style={{ textDecoration: "none" }}>
              <div className="landing-logo-icon" style={{ width: 32, height: 32 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="gradient-text" style={{ fontSize: "1.1rem", fontWeight: 700 }}>FoodOrder</span>
            </div>
            <p className="footer-tagline">Fresh food from your favorite restaurants, delivered fast.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Platform</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#about">About</a>
            </div>
            <div className="footer-col">
              <h4>Account</h4>
              <Link href="/login">Log In</Link>
              <Link href="/register">Sign Up</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 FoodOrder. All rights reserved. Built with Next.js, NestJS & GraphQL.</p>
        </div>
      </footer>
    </div>
  );
}
