# Chelari Tradings — Modern 3D Architectural Web Experience

Kerala's premier architectural showroom for **Glass, Plywood, Hardware, Modular Kitchen Accessories, and Built-in Home Appliances**.

- **Website**: [chelaritradings.com](https://chelaritradings.com)
- **Instagram**: [@chelaritradings](https://www.instagram.com/chelaritradings?mdxt=NmFubG5rajdydWVq)
- **Flagship Location**: Chelari, Calicut Bypass, Malappuram, Kerala 676317
- Phone number: 9072555257, 9895075235
- TEL: 0494 2942656

---

## 🏛️ Design Language & Architecture

Inspired by high-end architectural studios (such as Graft Studio) with bespoke 3D effects, clean typography, and tactile showroom interactivity:

1. **3D Tilt Engine with Specular Reflection**:
   - Real-time mouse perspective tilting (`perspective(1000px) rotateX(...) rotateY(...)`) on hero and product cards.
   - Dynamic cursor-tracking light sheen reflection.

2. **Core Architectural Disciplines (5 Divisions)**:
   - **Glass**: Toughened & laminated safety glass, fluted/reeded partitions, smart mirrors.
   - **Plywood**: 100% Gurjan hardwood core IS:710 Marine Calibrated Plywood, acoustic louvres, natural rock veneers.
   - **Hardware**: Forged brass knurled levers, digital touchscreen biometric locks, heavy-duty mortise locks, wardrobe pulls.
   - **Modular Kitchen Accessories**: Soft-close tandem boxes, tall pantry units, magic corners, cutlery organizers.
   - **Home Appliances**: Flush-mounted induction hobs, quiet motion-sensor chimneys, built-in ovens and microwave suites.

3. **Interactive 3D Material Studio**:
   - Switch between materials with live visual crossfades, technical specifications, and interactive hotspot tooltips.

4. **Digital Marketing Project Estimator & WhatsApp Lead Generator**:
   - Interactive questionnaire tailored for architects, builders, and homeowners.
   - Generates customized pre-filled WhatsApp inquiry links directly to Chelari Tradings specialists.

5. **Showroom Experience Center**:
   - Showcasing Chelari Tradings' multi-floor experience center with direct Google Maps directions.

---

## 📁 Project Structure

```
chelaritradings-website/
├── index.html                     # Main interactive 3D landing page
├── about.html                     # Showroom heritage & standards page
├── event.html                     # Marketing & customer gift reward review campaign page
├── css/
│   ├── style.css                  # Modern CSS design tokens, 3D tilt, and responsive layout
│   └── event.css                  # Event-specific styling, step flow, dropzone, and celebration modal
├── js/
│   ├── main.js                    # 3D Tilt, material switcher, specs modal, and WhatsApp generator
│   └── event.js                   # 1-Click copy, Google Reviews redirect, screenshot upload & admin mail engine
└── assets/
    └── images/
        ├── logo.png               # High-res master logo
        ├── logo-nav.png           # Auto-cropped navigation logo
        ├── features/              # Web-optimized architectural 3D feature renders
        ├── optimized/             # Web-optimized showroom product photos (120KB avg)
        └── products/              # Original high-res showroom photography
```

---

## 🚀 Running Locally

To run the project locally with any static web server:

```bash
# Python 3
python3 -m http.server 3000

# Open in browser:
# http://localhost:3000
```