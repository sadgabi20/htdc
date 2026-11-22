// ===== HTDC (HyperText Document Compositor) sample document ===== //
// ===== Programmatic API usage ===== //
import { html2pdf, HTDC } from "../../src/index.ts";

const doc = new HTDC();

// ===== SET PDF FILE NAME ===== //
doc.fileName = 'THE_EVOLUTION_OF_DESTROYER_DESIGN';

// ===== SECTION 1 ===== //
doc.section("introduction");

doc.title("The Evolution of Destroyer Design");
doc.subtitle("Speed, Torpedoes, and Surface Warfare in the 1930s");

doc.h1("Speed, Torpedoes, and Surface Warfare in the 1930s");

doc.p("Originally conceived as torpedo boat destroyers in the late nineteenth century, the destroyer rapidly evolved into the backbone of modern blue-water navies. By the 1930s, naval architects focused heavily on maximizing top speed and torpedo broadside weight while maintaining enough endurance for ocean-going fleet operations.");

doc.img('./img/zumwalt_dd.png', { width: 0.35 });

doc.p("Hull lines were lengthened and narrowed significantly to achieve high length-to-beam ratios. This hydrodynamic optimization allowed destroyers to sustain speeds exceeding 38 knots in calm seas, outpacing capital ships and screening cruisers alike.");

doc.h2("Propulsion and Armament Trade-offs");

doc.p("Pushing a warship past 35 knots required immense shaft horsepower, forcing engineers to balance armor protection against machinery weight. Most interwar designs sacrificed hull plating entirely in favor of three core capabilities:");

doc.beginList('ul');
doc.item("*High-Pressure Boilers*: Superheated steam turbines capable of rapid acceleration during fleet engagements.");
doc.item("*Heavy Torpedo Batteries*: Quadruple or quintuple launchers firing oxygen-enriched long-range torpedoes.");
doc.item("*Dual-Purpose Artillery*: Enclosed turrets engineered to engage both surface targets and high-altitude aircraft.");
doc.endList('ul');

doc.h2("Operational Deployment Sequence");
doc.p("During a standard nighttime torpedo run against an opposing battleline, destroyer squadrons executed a strict tactical sequence:");

doc.beginList('ol');
doc.item("*Reconnaissance and Contact*: Scout cruisers and vanguard destroyers locate the enemy main body using optical rangefinders and star shells.");
doc.item("*High-Speed Approach*: Divisions form in line-ahead formation, accelerating to flank speed under the cover of darkness or laid smoke screens.");
doc.item("*Firing Solution and Salvo*: Upon reaching optimal launch angles, ships turn simultaneously to unmask broadside tubes and release staggered torpedo spreads.");
doc.item("*Disengagement*: Vessels execute a sharp turn away from the target bearing, deploying smoke and rear-facing guns to deter pursuing pickets.");
doc.endList('ol');

// ===== SECTION 2 ===== //
doc.section("treaty-constraints");

doc.h1("Treaty Constraints");
doc.h2("Naval Treaties and Displacement Limits");

doc.p("The London Naval Treaty of 1930 imposed strict tonnage ceilings that fundamentally shaped destroyer construction throughout the decade. Standard destroyers were capped at 1,500 tons, while a smaller quota of flotilla leaders could reach 1,850 tons.");

doc.p("To circumvent these restrictions without sacrificing combat effectiveness, major naval powers adopted divergent engineering philosophies:");

doc.beginList('ul');
doc.item("*Imperial Japanese Navy*: Constructed the Fubuki and Kagero classes, prioritizing massive torpedo broadsides and heavy main batteries even at the cost of top-heaviness and hull stress.");
doc.item("*United States Navy*: Focused on high-pressure, high-temperature steam plants and electric welding to save structural weight, resulting in the long-range Mahan and Somers classes.");
doc.item("*Royal Navy*: Emphasized seakeeping, anti-submarine warfare integration, and balanced gun-torpedo armament across the A through I class progression.");
doc.endList('ul');

// ===== SECTION 3 ===== //
doc.section("conclusion");

doc.h1("Conclusion");
doc.h2("Transition to Multi-Role Escorts");

doc.p("By the outbreak of global conflict in 1939, the emergence of long-range naval aviation and advanced radar systems began shifting the destroyer's primary mission. While high-speed torpedo attacks remained decisive in night surface actions—particularly in the Pacific theater—destroyers increasingly operated as anti-aircraft and anti-submarine screens.");

doc.p("The engineering foundations laid during the 1930s—lightweight welded hulls, compact high-output propulsion, and dual-purpose fire control—enabled these vessels to adapt rapidly, cementing the destroyer as the most versatile combatant in modern naval warfare.");

// ===== COMPOSE PDF ===== //
const html = doc.toHTML();
await html2pdf(html);