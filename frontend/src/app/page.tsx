'use client';
import Link from "next/link";
import { FaUpload, FaPills, FaBrain, FaFileMedical, FaLock, FaCheckCircle, FaPlay, FaDna, FaRobot, FaVial, FaExchangeAlt, FaFileCode, FaNotesMedical } from "react-icons/fa";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, CartesianGrid, Cell } from 'recharts';
import ChatBot from "@/components/ChatBot";

const mockData = [
  { name: '0', value: 30 },
  { name: '20', value: 50 },
  { name: '40', value: 25 },
  { name: '60', value: 65 },
  { name: '80', value: 45 },
  { name: '100', value: 80 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,25 50,50 T100,50" stroke="#3b82f6" strokeWidth="0.5" fill="none" />
            <path d="M0,50 Q25,75 50,50 T100,50" stroke="#3b82f6" strokeWidth="0.5" fill="none" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight"
            >
              AI Powered Precision <br />
              <span className="text-blue-500">Medicine Algorithm</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-400 max-w-xl mb-8"
            >
              From Genetic Variants to Safer Prescriptions. PharmaGuard analyses genomic VCF files to predict personalized drug risks based on clinical guidelines.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/risk-analysis">
                <button className="px-6 py-3 bg-[#10b981] text-white font-semibold rounded-md shadow-lg hover:bg-[#059669] transition flex items-center gap-2">
                  Analyze VCF File
                </button>
              </Link>
              <Link href="/patient-hub">
                <button className="px-6 py-3 bg-transparent text-blue-500 border border-blue-500/30 font-semibold rounded-md hover:bg-blue-500/10 transition flex items-center gap-2">
                  <FaPlay size={12} /> View Demo
                </button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="bg-[#1e293b] rounded-2xl p-6 shadow-2xl relative overflow-hidden border border-gray-700 max-w-md ml-auto">
              <div className="flex gap-2 mb-4 opacity-50">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                <div className="inline-block px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full mb-2">High Risk</div>
                <h3 className="text-xl font-bold text-red-500">CYP2D6 Variant</h3>
                <p className="text-red-400 text-xs mt-1">Poor Metabolizer Phenotype</p>
                <div className="mt-4 pt-4 border-t border-red-500/10 text-[10px] text-red-300">
                  Recommendation: Avoid Codeine.
                </div>
              </div>
              <div className="mt-4 bg-gray-900/40 rounded-lg p-3 border border-gray-800">
                <div className="flex justify-between items-center text-[10px] text-gray-500 mb-1">
                  <span>AI Confidence Score</span>
                  <span>99.2%</span>
                </div>
                <div className="w-full bg-gray-800 h-1 rounded-full">
                  <div className="bg-blue-500 h-full w-[99%] rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <WorkflowCard
            icon={<FaUpload />}
            step="1"
            title="Upload Genomic VCF"
            desc="Securely upload patient genetic data."
            bg="bg-blue-100"
            color="text-blue-600"
          />
          <WorkflowCard
            icon={<FaPills />}
            step="2"
            title="Select Medication"
            desc="Choose specific pharmacogenomic drugs phenotype."
            bg="bg-cyan-100"
            color="text-cyan-600"
          />
          <WorkflowCard
            icon={<FaBrain />}
            step="3"
            title="AI Genotype Analysis"
            desc="Deep variant and classification phenotype."
            bg="bg-indigo-100"
            color="text-indigo-600"
          />
          <WorkflowCard
            icon={<FaFileMedical />}
            step="4"
            title="Clinical Risk Report"
            desc="Receive CPIC based and recommendations."
            bg="bg-teal-100"
            color="text-teal-600"
          />
        </div>
      </section>



      {/* Key Features */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div id="features" className="col-span-1 lg:col-span-2">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white">Platform Capabilities</h2>
            <p className="text-gray-400 mt-2">Comprehensive tools for precision medicine.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<FaDna />}
              title="Authentic VCF Parsing"
              desc="Securely processes real Variant Call Format (v4.2) files, extracting gene annotations, star alleles, and rsIDs to identify clinically relevant pharmacogenomic variants."
            />
            <FeatureCard
              icon={<FaNotesMedical />}
              title="CPIC Guideline Engine"
              desc="Implements evidence-based Clinical Pharmacogenetics Implementation Consortium (CPIC) rules to translate genotype data into validated drug response recommendations."
            />
            <FeatureCard
              icon={<FaRobot />}
              title="Explainable AI (XAI)"
              desc="Generates structured, biologically grounded explanations linking genetic variants to drug metabolism mechanisms, ensuring transparency in AI-driven decisions."
            />
            <FeatureCard
              icon={<FaVial />}
              title="Therapy Simulation Checks"
              desc="Applies genotype-adjusted pharmacokinetic modeling to simulate drug clearance, concentration changes, and toxicity probability for personalized treatment evaluation."
            />
            <FeatureCard
              icon={<FaExchangeAlt />}
              title="Drug Alternative Recommendation"
              desc="Identifies high-risk gene–drug interactions and suggests clinically appropriate alternative medications to improve therapeutic safety."
            />
            <FeatureCard
              icon={<FaFileCode />}
              title="Structured JSON Output"
              desc="Produces standardized, interoperable JSON reports including risk labels, confidence scores, phenotype classification, and audit metadata for seamless clinical integration."
            />
          </div>
        </div>
      </section>

      {/* Supported Genomic Targets */}
      <section id="targets" className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Supported Genomic Targets</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              PharmaGuard screens for high-evidence Pharmacogenomic (PGx) associations recommended by CPIC guidelines.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <TargetCard drug="Codeine" gene="CYP2D6" category="Analgesic" risk="High Risk" />
            <TargetCard drug="Warfarin" gene="CYP2C9" category="Anticoagulant" risk="Critical" />
            <TargetCard drug="Clopidogrel" gene="CYP2C19" category="Antiplatelet" risk="High Risk" />
            <TargetCard drug="Simvastatin" gene="SLCO1B1" category="Statin" risk="Moderate" />
            <TargetCard drug="Azathioprine" gene="TPMT" category="Immunosupp" risk="High Toxicity" />
            <TargetCard drug="Fluorouracil" gene="DPYD" category="Oncology" risk="Fatal Toxicity" />
          </div>
        </div>
      </section>

      {/* AI Chatbot Section */}
      <ChatBot />

      {/* Security Section */}
      <section className="py-16 bg-[#0a0a0a] border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-blue-900/10 rounded-2xl p-10 border border-blue-900/20 inline-block w-full">
            <h2 className="text-2xl font-bold text-white mb-2">Secure & Private Processing</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Your genomic data is encrypted and processed locally where possible. We adhere to strict HIPAA and GDPR guidelines.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <button className="px-8 py-3 bg-[#3b82f6] text-white font-bold rounded-md hover:bg-blue-700 transition shadow-sm w-full sm:w-auto">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-8 py-3 bg-[#10b981] text-white font-bold rounded-md hover:bg-green-600 transition shadow-sm w-full sm:w-auto">
                  Signup
                </button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-400">Encrypted Processing</p>
          </div>
        </div>
      </section >

    </div >
  );
}

function WorkflowCard({ icon, title, desc, bg, color }: any) {
  return (
    <div className={`p-6 rounded-2xl bg-gray-900/50 border border-gray-800 shadow-sm hover:border-gray-700 transition group`}>
      <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition duration-300 bg-opacity-10`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="flex gap-4 p-5 bg-gray-900/50 border border-gray-800 rounded-xl shadow-sm hover:border-gray-700 transition-all duration-300">
      <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center text-lg">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function TargetCard({ drug, gene, category, risk }: any) {
  return (
    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 shadow-sm text-center hover:border-gray-700 hover:-translate-y-1 transition-all duration-300 group">
      <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">{category}</div>
      <div className="font-bold text-white text-lg mb-1">{drug}</div>
      <div className="flex items-center justify-center gap-2 my-3 text-gray-600">
        <div className="h-[1px] w-4 bg-gray-700"></div>
        <div className="text-[10px] uppercase">Linked To</div>
        <div className="h-[1px] w-4 bg-gray-700"></div>
      </div>
      <div className="inline-block px-4 py-1.5 bg-gray-800 text-gray-300 font-mono text-sm font-bold rounded-lg border border-gray-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
        {gene}
      </div>
    </div>
  )
}










