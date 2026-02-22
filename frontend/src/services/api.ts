// Use current origin if in browser, otherwise fallback to localhost for local dev
const isBrowser = typeof window !== 'undefined';
const API_BASE_URL = isBrowser
    ? (window.location.origin.includes('localhost') ? 'http://localhost:8000' : '/api')
    : 'http://localhost:8000';

export interface AnalysisResult {
    patient_id: string;
    drug: string;
    timestamp: string;
    risk_assessment: {
        risk_label: string;
        confidence_score: number;
        severity: string;
    };
    pharmacogenomic_profile: {
        primary_gene: string;
        diplotype: string;
        phenotype: string;
        detected_variants: Array<{
            rsid: string;
            genotype: string;
            chromosome?: string;
            position?: number;
            ref?: string;
            alt?: string;
        }>;
    };
    clinical_recommendation: {
        recommendation_text: string;
    };
    llm_generated_explanation: {
        summary: string;
        mechanism: string;
        clinical_interpretation: string;
    };
    quality_metrics?: {
        vcf_parsing_success: boolean;
        rule_engine_match: boolean;
        llm_validation_status: string;
    };
}

export interface AnalysisRecord {
    id: number;
    patient_id: string;
    drug: string;
    timestamp: string;
    primary_gene: string;
    phenotype: string;
    diplotype: string;
    risk_label: string;
    recommendation: string;
    full_result_json: string;
}

export interface GeneProfile {
    gene: string;
    diplotype: string;
    phenotype: string;
    variants_count: number;
}

export const api = {
    // Analyze VCF for a specific drug
    analyze: async (file: File, drug: string): Promise<AnalysisResult> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('drug', drug);

        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || `API Error: ${response.statusText}`);
        }

        return await response.json();
    },

    // Get analysis history
    getHistory: async (): Promise<AnalysisRecord[]> => {
        const response = await fetch(`${API_BASE_URL}/history`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return await response.json();
    },

    // Get full genomic profile (all supported genes)
    getProfile: async (file: File): Promise<GeneProfile[]> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || `API Error: ${response.statusText}`);
        }

        return await response.json();
    },

    // Chat with AI
    chat: async (message: string, context?: any): Promise<{ response: string }> => {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, context }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return await response.json();
    },

    // Save Clinical Data
    saveClinicalData: async (data: any): Promise<any> => {
        const response = await fetch(`${API_BASE_URL}/patient/clinical`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to save clinical data");
        return await response.json();
    },

    // Get Clinical Data
    getClinicalData: async (patientId: string): Promise<any> => {
        const response = await fetch(`${API_BASE_URL}/patient/clinical/${patientId}`);
        if (!response.ok) throw new Error("Failed to fetch clinical data");
        return await response.json();
    },

    // Book Appointment
    bookAppointment: async (appointmentData: any): Promise<any> => {
        const response = await fetch(`${API_BASE_URL}/api/book-appointment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Failed to book appointment");
        }
        return await response.json();
    },

    // Get Appointments
    getAppointments: async (): Promise<any[]> => {
        const response = await fetch(`${API_BASE_URL}/api/appointments`);
        if (!response.ok) throw new Error("Failed to fetch appointments");
        return await response.json();
    }
};
