
import React from 'react';
import type { ExamResult } from '@/lib/types';

interface CertificateData extends Omit<ExamResult, 'id' | 'submittedAt' | 'responses' | 'timeTaken'> {
  certificateId: string;
  issueDate: string;
  examDate: string;
  percentage: number;
  logoUrl: string;
  watermarkUrl: string;
  goldSealUrl: string;
  signatureUrl: string;
}

export default function CertificateTemplate(data: CertificateData) {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    }

    const styles: { [key: string]: React.CSSProperties } = {
        page: {
            width: '1123px',
            height: '794px',
            boxSizing: 'border-box',
            backgroundColor: '#F7F5F2', // Soft paper texture color
            fontFamily: '"Playfair Display", serif',
            color: '#0A2342', // Dark Navy Blue
            position: 'relative',
            padding: '25px',
        },
        borderOuter: {
            position: 'absolute',
            top: '25px', left: '25px', right: '25px', bottom: '25px',
            border: '8px solid #0A2342',
            padding: '8px',
            boxSizing: 'border-box',
        },
        borderInner: {
            width: '100%', height: '100%',
            border: '2px solid #C9A24B', // Gold color
            boxSizing: 'border-box',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '20px',
        },
        watermark: {
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.08,
            width: '550px',
            height: '550px',
            zIndex: 1,
        },
        content: {
            width: '100%',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '20px',
        },
        logo: {
            width: '80px',
            height: '80px',
            marginBottom: '15px',
        },
        instituteName: {
            fontFamily: '"Playfair Display", serif',
            fontSize: '28pt',
            fontWeight: 700,
            color: '#0A2342',
            margin: '0 0 10px 0',
        },
        mainTitle: {
            fontFamily: '"Playfair Display", serif',
            fontSize: '48pt',
            fontWeight: 700,
            color: '#0A2342',
            margin: '0 0 15px 0',
            letterSpacing: '2px',
        },
        presentedTo: {
            fontSize: '16pt',
            color: '#555',
            margin: '10px 0 0 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
        },
        certifyText: {
            fontSize: '14pt',
            color: '#333',
            margin: '5px 0',
        },
        studentName: {
            fontFamily: '"Great Vibes", cursive',
            fontSize: '60pt',
            fontWeight: 400,
            color: '#C9A24B', // Gold color
            margin: '-15px 0 0 0',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
        },
        bodyText: {
            fontSize: '15pt',
            lineHeight: 1.6,
            color: '#333',
            margin: '25px 0 0 0',
        },
        courseName: {
            fontWeight: 'bold',
        },
        bottomSection: {
            position: 'absolute',
            bottom: '40px',
            left: '60px',
            right: '60px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
        },
        signatureBlock: {
            width: '220px',
            textAlign: 'center',
            fontSize: '12pt',
            position: 'relative',
        },
        mainSeal: {
             width: '120px',
             height: '120px',
             alignSelf: 'center',
             marginBottom: '15px'
        },
        signatureImage: {
            height: '50px',
            width: 'auto',
            marginBottom: '5px',
        },
        signatureLine: {
            borderTop: '1px solid #555',
            margin: '0 auto',
            width: '70%',
        },
        signatureTitle: {
            marginTop: '8px',
            fontWeight: 'bold',
            color: '#0A2342',
        },
        footerContainer: {
            position: 'absolute',
            bottom: '15px',
            left: '40px',
            right: '40px',
            display: 'flex',
            justifyContent: 'center',
            fontSize: '10pt',
            color: '#555',
        },
        registrationNumber: {
            position: 'absolute',
            top: '20px',
            right: '40px',
            fontSize: '10pt',
            color: '#555',
            zIndex: 2,
        },
        certificateIdTopLeft: {
             position: 'absolute',
            top: '20px',
            left: '40px',
            fontSize: '10pt',
            color: '#555',
            zIndex: 2,
        }
    };
    
    return (
        <div style={styles.page}>
            <div style={styles.borderOuter}>
                <div style={styles.borderInner}>
                    <span style={styles.certificateIdTopLeft}>Certificate ID: {data.certificateId}</span>
                    <span style={styles.registrationNumber}>Registration No: {data.registrationNumber}</span>
                    <img src={data.watermarkUrl} style={styles.watermark} alt="Watermark" />
                    <div style={styles.content}>
                        <img src={data.logoUrl} style={styles.logo} alt="Education Pixel Logo" />
                        <h1 style={styles.instituteName}>Education Pixel</h1>
                        <h2 style={styles.mainTitle}>Certificate of Completion</h2>
                        <p style={styles.presentedTo}>PROUDLY PRESENTED TO</p>

                        <p style={styles.certifyText}>This is to certify that</p>
                        <p style={styles.studentName}>{data.studentName}</p>
                        
                        <p style={styles.bodyText}>
                            has successfully completed the
                            <br />
                            <span style={styles.courseName}>{data.testName} Course</span>
                        </p>
                    </div>

                    <div style={styles.bottomSection}>
                        <div style={styles.signatureBlock}>
                            <img src={data.signatureUrl} style={styles.signatureImage} alt="Director's Signature" />
                            <div style={styles.signatureLine}></div>
                            <p style={styles.signatureTitle}>Director</p>
                        </div>
                        
                        <img src={data.goldSealUrl} style={styles.mainSeal} alt="Golden Seal" />

                        <div style={styles.signatureBlock}>
                             <img src={data.signatureUrl} style={styles.signatureImage} alt="Controller's Signature" />
                            <div style={styles.signatureLine}></div>
                            <p style={styles.signatureTitle}>Exam Controller</p>
                        </div>
                    </div>

                     <div style={styles.footerContainer}>
                        <span>Issued on: {formatDate(data.issueDate)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
