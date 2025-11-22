import React from 'react';
import type { ExamResult } from '@/lib/types';

interface CertificateData extends Omit<ExamResult, 'id' | 'submittedAt' | 'responses' | 'timeTaken'> {
  certificateId: string;
  issueDate: string;
  examDate: string;
  percentage: number;
  logoUrl: string;
  directorSignUrl: string;
  controllerSignUrl: string;
}

// NOTE: This component is designed to be rendered to a static string for PDF generation.
// It uses inline styles because Tailwind classes won't be available in the jsPDF environment.
// Ensure all assets (images, fonts) are loaded with absolute URLs or are base64 encoded.
export default function CertificateTemplate(data: CertificateData) {

    // Styles are defined inline for compatibility with html2canvas and jsPDF
    const styles = {
        page: {
            width: '1123px',
            height: '794px',
            padding: '40px',
            boxSizing: 'border-box' as 'border-box',
            backgroundColor: '#ffffff',
            fontFamily: 'Helvetica, Arial, sans-serif',
            color: '#333',
            position: 'relative' as 'relative',
        },
        border: {
            position: 'absolute' as 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '20px',
            border: '5px double #30475E',
            boxSizing: 'border-box' as 'border-box',
        },
        watermark: {
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.07,
            width: '400px',
            height: '400px',
        },
        content: {
            textAlign: 'center' as 'center',
            position: 'relative' as 'relative',
            zIndex: 2,
        },
        logo: {
            width: '100px',
            height: '100px',
            margin: '0 auto 10px',
        },
        mainTitle: {
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: '32pt',
            fontWeight: 'bold' as 'bold',
            color: '#30475E',
            margin: '10px 0 5px 0',
        },
        subtitle: {
            fontSize: '16pt',
            color: '#555',
            margin: '0 0 20px 0',
            letterSpacing: '1px',
        },
        bodyText: {
            fontSize: '14pt',
            lineHeight: 1.6,
            color: '#444',
            margin: '20px 0',
        },
        studentName: {
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: '28pt',
            fontWeight: 'bold' as 'bold',
            color: '#2E8B57',
            margin: '20px 0',
            borderBottom: '2px solid #2E8B57',
            display: 'inline-block' as 'inline-block',
            paddingBottom: '5px',
        },
        courseName: {
            fontSize: '16pt',
            fontWeight: 'bold' as 'bold',
            color: '#30475E',
        },
        signatureContainer: {
            position: 'absolute' as 'absolute',
            bottom: '80px',
            left: '40px',
            right: '40px',
            display: 'flex',
            justifyContent: 'space-between',
        },
        signatureBlock: {
            width: '200px',
            textAlign: 'center' as 'center',
            fontSize: '12pt',
        },
        signatureImage: {
            height: '50px',
            width: 'auto',
            marginBottom: '5px',
        },
        signatureLine: {
            borderTop: '1px solid #333',
            margin: '0 auto',
            width: '100%',
        },
        signatureTitle: {
            marginTop: '8px',
            fontWeight: 'bold' as 'bold',
            color: '#30475E',
        },
        footerContainer: {
            position: 'absolute' as 'absolute',
            bottom: '40px',
            left: '40px',
            right: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10pt',
            color: '#777',
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.border}>
                <img src={data.logoUrl} style={styles.watermark} alt="Watermark" />
                <div style={styles.content}>
                    <img src={data.logoUrl} style={styles.logo} alt="MTech IT Institute Logo" />
                    <h1 style={styles.mainTitle}>Certificate of Completion</h1>
                    <h2 style={styles.subtitle}>PROUDLY PRESENTED TO</h2>

                    <p style={styles.bodyText}>This is to certify that</p>
                    <p style={styles.studentName}>{data.studentName}</p>
                    <p style={styles.bodyText}>
                        has successfully completed the course
                        <br />
                        <span style={styles.courseName}>{data.testName}</span>
                        <br />
                        with a score of <strong>{data.score}/{data.totalMarks} ({data.percentage.toFixed(2)}%)</strong> on {data.examDate}.
                    </p>
                </div>

                <div style={styles.signatureContainer}>
                    <div style={styles.signatureBlock}>
                        <img src={data.directorSignUrl} style={styles.signatureImage} alt="Director's Signature" />
                        <div style={styles.signatureLine}></div>
                        <p style={styles.signatureTitle}>Director</p>
                    </div>
                    <div style={styles.signatureBlock}>
                        <img src={data.controllerSignUrl} style={styles.signatureImage} alt="Exam Controller's Signature" />
                        <div style={styles.signatureLine}></div>
                        <p style={styles.signatureTitle}>Exam Controller</p>
                    </div>
                </div>

                <div style={styles.footerContainer}>
                    <span>Certificate ID: {data.certificateId}</span>
                    <span>Registration No: {data.registrationNumber}</span>
                    <span>Issued on: {data.issueDate}</span>
                </div>
            </div>
        </div>
    );
}