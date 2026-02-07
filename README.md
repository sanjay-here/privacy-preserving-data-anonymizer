[Live Demo](https://privacy-preserving-data-anonymizer.vercel.app/)

# Privacy-Preserving Data Anonymizer 🔐

Securely anonymize sensitive CSV data while preserving analytical value.

Privacy-Preserving Data Anonymizer is a full stack web application designed to protect sensitive information in CSV datasets. The system intelligently detects Personally Identifiable Information (PII) and applies appropriate anonymization techniques to ensure privacy while maintaining data usability for analytics and research.

Upload a CSV → Detect sensitive fields → Apply anonymization → Preview results → Download clean dataset.

---

## 🚀 Key Features

### 📂 CSV Upload & Processing
- Upload CSV files up to 10MB
- Automatic column detection
- Structured parsing and validation
- In-memory processing (no permanent storage)

### 🧠 Smart PII Detection
Automatically identifies sensitive fields such as:
- Names
- Email addresses
- Phone numbers
- Dates of birth
- Aadhar-like identifiers
- Custom sensitive columns

Detection is based on pattern matching, validation rules, and intelligent field classification.

### 🔄 Multiple Anonymization Techniques
Depending on the data type, the system applies:

- **Data Masking** – Hide parts of sensitive values  
- **Generalization** – Convert exact values into ranges (e.g., Age 24 → 20–30)  
- **Pseudonymization** – Replace real data with realistic synthetic values  
- **Data Shuffling** – Shuffle column values to break linkage  
- **Faker-based Replacement** – Generate synthetic but valid data  

### 👀 Preview Before Download
- Instantly preview anonymized dataset
- Compare original vs transformed data
- Download anonymized CSV file

### 🔐 Privacy-Focused Design
- No permanent storage of uploaded files
- Temporary server-side processing
- Secure file validation
- Clean CSV export without metadata leaks

---

## 🏗️ How It Works

1. User uploads a CSV file
2. Backend parses and analyzes column types
3. Sensitive attributes are detected
4. Appropriate anonymization method is applied
5. User previews processed data
6. Anonymized CSV is generated for download

---

## 💻 Tech Stack

| Technology   | Role |
|--------------|------|
| React.js     | Frontend UI |
| Node.js      | Backend runtime |
| Express.js   | API routing |
| CSV Parser   | Structured data processing |
| Faker.js     | Synthetic data generation |
| JavaScript   | Core application logic |

---

## 🛡️ Use Cases

- Academic research datasets
- Secure data sharing
- Privacy compliance demonstrations
- Database security projects
- Data publishing simulations

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v16 or above)
- npm

### Clone the Repository

```bash
git clone https://github.com/sanjay-here/privacy-preserving-data-anonymizer.git
cd privacy-preserving-data-anonymizer
