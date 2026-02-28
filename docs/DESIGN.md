1. Design System Foundation
Brand Personality

The platform communicates:

Modern → technology-driven SaaS credibility

Warm → food discovery should feel emotional & appetizing

Fast → quick ordering decisions

Trustworthy → payment & delivery confidence

Scalable → enterprise SaaS reliability

Core Design Principles
1. Clarity Over Decoration

Users must decide within 3 seconds:

What to eat

From where

How fast

Visual noise is eliminated.

2. Hierarchical Decision UX

Interface prioritizes:

Food imagery

Restaurant trust signals

Price & delivery time

CTA actions

3. Consistency at Scale

Reusable tokens:

spacing

typography

elevation

interaction states

Supports multi-brand SaaS expansion.

4. Accessibility First

Designed to meet WCAG 2.2 AA minimum.

UI Philosophy

Minimal SaaS Structure + Vibrant Food Energy

SaaS clarity for dashboards

Rich visuals for food discovery

Calm checkout environment

2. Color Palette
Primary Palette
Role	Color	HEX	Usage
Primary Brand	Appetite Orange	#FF6B35	CTA, highlights
Secondary Accent	Fresh Green	#22C55E	success & freshness
Dark Mode Primary	Warm Orange	#FF8A5B	CTA dark
Emotional Reasoning

Orange increases appetite & urgency.

Green reinforces freshness & trust.

Warm tones improve conversion behavior.

Functional Colors
Function	HEX	Usage
Success	#16A34A	Order confirmed
Warning	#F59E0B	Delivery delay
Error	#DC2626	Payment failure
Info	#2563EB	Updates
Neutral System
Token	HEX
Background	#F8FAFC
Surface	#FFFFFF
Border	#E5E7EB
Text Primary	#111827
Text Secondary	#6B7280
Disabled	#9CA3AF
Contrast Compliance

Text ≥ 4.5:1

CTA ≥ 3:1

Dark mode verified for accessibility.

3. Typography System
Font Family

Primary:
👉 Inter Variable

Fallback:

Inter, system-ui, -apple-system, sans-serif

Reason:

Excellent readability

SaaS standard

Numeric clarity for pricing

Heading Scale
Style	Size
H1	40px
H2	32px
H3	24px
H4	20px
H5	18px
H6	16px
Body Typography
Type	Size
Body Large	16px
Body	14px
Caption	12px
Button Text

14–16px

Medium weight

Slight letter spacing

Price Styling
₹349

SemiBold

Larger baseline

Tabular numeric alignment

Reason: price scanning speed ↑.

4. Layout Grid System
Desktop Grid

12 Columns

Max width: 1440px

Gutter: 24px

Margin: 80px

Tablet Grid

8 Columns

20px gutters

Mobile Grid

4 Columns

16px gutters

Spacing System

8pt Scale

8 / 16 / 24 / 32 / 48 / 64

Ensures rhythm consistency.

Breakpoints
Device	Width
Mobile	<768px
Tablet	768–1024px
Desktop	>1024px
Admin Sidebar

Expanded: 240px

Collapsed: 72px

5. Component Library
Navigation Components
Top Navbar

Purpose:

Search

Location

Profile

Cart

States:

sticky

elevated on scroll

Sidebar (Admin)

Variants:

Expanded

Icon-only

Hover reveal

Mobile Bottom Navigation

Contains:

Home

Search

Orders

Profile

Cart

Thumb reachable.

Breadcrumbs

Used in:

Admin

Restaurant hierarchy

Cards
Restaurant Card

Hierarchy:

Image

Name

Rating

Delivery Time

CTA

States:

hover lift

quick add

Food Item Card

Includes:

image

description

calories (optional)

add button

Order Summary Card

Sticky behavior during checkout.

Analytics Card

Admin KPIs:

revenue

trend arrow

timeframe selector

Forms
Inputs

States:

default

focus

error

success

disabled

Search Bar

Auto-suggestion + recent searches.

Dropdown

Keyboard navigable.

Quantity Selector
[-] 2 [+]

Rapid tap optimized.

Address Form

Auto-fill + map validation.

Payment Form

Supports:

saved cards

UPI

wallet

Buttons
Type	Usage
Primary	Order actions
Secondary	Supporting
Ghost	Minimal
Destructive	Delete
Loading	Spinner lock
Feedback Components

Toast (4s auto dismiss)

Modal confirmation

Slide Drawer

Tooltip

Empty States

Skeleton Loader

Data Components
Tables

sortable

sticky headers

row actions

Filters

Chip-based filtering.

Pagination

Infinite scroll (customer)
Number pagination (admin).

Status Badges
Pending
Preparing
Delivered
Cancelled

Color-coded.

6. Customer Pages Architecture
Home Page

Structure:

Hero Section
→ Location selector
→ Smart search
→ Cuisine categories
→ Featured restaurants
→ Promotions
→ Popular near you

Conversion Strategy:

immediate food exposure

minimal scrolling friction.

Restaurant Listing Page

Left Filter Sidebar:

cuisine

rating

delivery time

veg/non-veg

price

Main:
Grid restaurant cards.

Sorting:

popularity

delivery speed

rating.

Restaurant Detail Page

Sticky Header:

restaurant info

rating

delivery promise

Menu UX:

category tabs

scroll sync navigation

Add-to-cart:
Instant feedback animation.

Reviews:
Trust reinforcement.

Cart Page

Editable items
Quantity change
Promo input
Tax breakdown

Primary CTA:
✅ Continue Checkout

Auto save cart state.

Checkout Page

Two-column layout:

Left:

address

delivery slot

payment

Right:

sticky order summary

Trust Signals:

secure payment badge

ETA guarantee.

7. Admin Dashboard Structure
Layout Pattern
Sidebar | Content | Utility Bar
Admin Overview

Components:

Revenue graph

Orders trend

User growth

KPI cards

Recent orders

Orders Management

Data table:

order id

customer

restaurant

status

value

Drawer:
Full order details.

Restaurant Management

Features:

onboarding approval

menu CRUD

performance analytics

User Management

roles

permissions

activity logs.

Settings

payment gateway

commission rules

notifications.

8. Checkout UX Optimization
Progress Indicator
Cart → Address → Payment → Confirm
Inline Validation

Errors appear instantly.

Guest Checkout

No forced login.

One-Click Reorder

Past orders accessible.

Error Recovery

Payment retry without cart loss.

9. Responsive Strategy
Mobile-First Logic

Design begins at 360px.

Layout Behavior

Desktop → Grid
Tablet → Reduced grid
Mobile → Vertical stack

Sidebar Logic

Desktop: persistent
Tablet: collapsible
Mobile: drawer.

Touch Targets

Minimum:

44px × 44px
Responsive Tables

Convert into:

stacked cards

expandable rows.

10. Accessibility & Performance
Compliance

✅ WCAG 2.2 AA

Accessibility Features

keyboard navigation

visible focus ring

aria labels

semantic HTML

Screen Reader Strategy

Logical DOM ordering.

Performance UX

skeleton loaders

lazy image loading

progressive rendering.

11. Interaction & Motion Design
Motion Principles

Fast • Subtle • Meaningful

Duration:

150–250ms
Microinteractions
Interaction	Motion
Add to cart	bounce feedback
Button hover	elevation
Page load	fade
Drawer open	slide
Success	check animation
Cart Feedback

Floating mini-cart animation reinforces action success.

Notification Timing

Toast: 4 sec

Error: persistent until resolved.