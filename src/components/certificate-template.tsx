
import React from 'react';
import type { ExamResult, ExamRegistration } from '@/lib/types';
import { format, parseISO } from 'date-fns';

interface CertificateData extends Omit<ExamResult, 'id' | 'submittedAt' | 'responses' | 'timeTaken'> {
  registration: ExamRegistration;
  certificateId: string;
  issueDate: string;
  examDate: string;
  percentage: number;
  grade: string;
  logoUrl: string;
  studentPhotoUrl: string;
  certificateImageUrl: string;
}

export default function CertificateTemplate(data: CertificateData) {
    const styles: { [key: string]: React.CSSProperties } = {
        page: {
            width: '1123px',
            height: '794px',
            boxSizing: 'border-box',
            fontFamily: '"Calibri", "Arial", sans-serif',
            color: '#000',
            position: 'relative',
            backgroundColor: '#fff',
            overflow: 'hidden',
            padding: '25px',
        },
        border: {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            border: '2px solid #b08c54',
        },
        backgroundWatermark: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.08,
            width: '400px',
            height: 'auto',
            zIndex: 0,
        },
        curveTopLeft: {
            position: 'absolute', top: '0', left: '0', height: '200px', width: 'auto', zIndex: 2
        },
        curveBottomRight: {
            position: 'absolute', bottom: '0', right: '0', height: '250px', width: 'auto', zIndex: 2
        },
        content: {
            position: 'relative',
            zIndex: 1,
            padding: '20px 40px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        header: {
            display: 'flex', alignItems: 'center', gap: '20px',
        },
        logo: { width: '100px', height: '100px', border: '3px solid #000', borderRadius: '50%' },
        instituteDetails: {
            textAlign: 'center', color: '#c00000', flexGrow: 1, padding: '0 20px'
        },
        instituteName: { fontSize: '48px', fontWeight: 'bold', fontFamily: '"Times New Roman", serif', letterSpacing: '2px', lineHeight: 1 },
        tagline: { fontSize: '24px', fontWeight: 'bold', fontFamily: '"Brush Script MT", cursive', margin: '5px 0', color: '#0070c0' },
        subHeading: { fontSize: '10px', margin: 0, lineHeight: '1.2', color: '#000', fontWeight: 'bold' },

        regAndPhotoSection: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '15px'
        },
        regDetails: { fontSize: '15px', fontWeight: 'bold', lineHeight: 1.8, color: '#000' },
        studentPhoto: { width: '100px', height: '120px', border: '3px solid #000', objectFit: 'cover' },
        
        mainBody: {
            textAlign: 'center', marginTop: '5px', flexGrow: 1,
        },
        certificateImage: {
             width: '250px',
             height: 'auto',
             margin: '0 auto 5px auto',
        },
        
        studentInfo: {
            textAlign: 'left', fontSize: '16px', lineHeight: 1.6, width: '100%',
            marginTop: '10px', fontFamily: '"Times New Roman", serif'
        },
        detailRow: {
            display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5px',
            fontSize: '15px', fontWeight: 'bold'
        },

        footerSection: {
            display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
            width: '100%', padding: '10px 0 0 0', marginTop: 'auto'
        },
        signatureBlock: {
            textAlign: 'center', width: '200px', fontSize: '14px', fontWeight: 'bold' 
        },
        signatureLine: {
            borderBottom: '1px solid black', paddingBottom: '30px', marginBottom: '5px' 
        },
        
        gradingBar: {
            backgroundColor: '#c00000', color: 'white', fontSize: '11px', fontWeight: 'bold',
            textAlign: 'center', padding: '3px', width: '100%', margin: '15px 0'
        },
        
        footerBar: {
            position: 'absolute', bottom: '25px', left: '25px', right: '25px',
            borderTop: '2px solid #b08c54',
            paddingTop: '5px',
            textAlign: 'center',
            fontSize: '11px',
        },
    };
    
    const admissionDate = data.registration.registeredAt?.toDate ? format(data.registration.registeredAt.toDate(), 'dd-MM-yyyy') : format(new Date(data.examDate), 'dd-MM-yyyy');

    return (
        <div style={styles.page}>
            <div style={styles.border}></div>
            <img style={styles.backgroundWatermark} src={data.logoUrl} alt="Watermark"/>
            <img style={styles.curveTopLeft} src="https://res.cloudinary.com/dqycipmr0/image/upload/v1766898495/cert-curve-left_jwqfxq.png" alt="Decorative Curve"/>
            <img style={styles.curveBottomRight} src="https://res.cloudinary.com/dqycipmr0/image/upload/v1766898495/cert-curve-right_eywnp1.png" alt="Decorative Curve"/>

            <div style={styles.content}>
                <div style={styles.header}>
                    <img src={data.logoUrl} style={styles.logo} alt="Institute Logo" />
                    <div style={styles.instituteDetails}>
                        <h1 style={styles.instituteName}>EDUCATION PIXEL</h1>
                        <p style={styles.tagline}>Learn focus & Grow</p>
                        <p style={styles.subHeading}>Run under: AROGYA JEEVAN SOCIAL HEALTHCARE FOUNDATION</p>
                        <p style={styles.subHeading}>Reg by: Ministry of Corporate Affairs (Govt. of India)</p>
                        <p style={styles.subHeading}>Regd. NITI Aayog Unique ID: UP/2022/0304937 (AN ISO 9001:2015 Certified)</p>
                    </div>
                </div>

                <div style={styles.regAndPhotoSection}>
                    <div style={styles.regDetails}>
                        <p>Regd. No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {data.registration.registrationNumber}</p>
                        <p>Certificate No. : {data.certificateId}</p>
                    </div>
                    <img src={data.studentPhotoUrl} style={styles.studentPhoto} alt="Student" />
                </div>

                <div style={styles.mainBody}>
                     <img 
                        src={data.certificateImageUrl}
                        style={styles.certificateImage} 
                        alt="Certificate Emblem" 
                    />
                    <div style={styles.studentInfo}>
                        <p>We are much pleased to honour Mr./Ms./Mrs : <span style={{fontWeight: 'bold', display: 'inline-block', marginLeft: '10px'}}>{data.studentName}</span></p>
                        <p>Son/Daughter/Wife Mr. : <span style={{fontWeight: 'bold', display: 'inline-block', marginLeft: '10px'}}>{data.registration.fatherName}</span></p>
                        <p>Has successfully completed a course of : <span style={{fontWeight: 'bold', display: 'inline-block', marginLeft: '10px'}}>{data.courseName.toUpperCase()}</span></p>
                        
                        <div style={styles.detailRow}>
                            <span>Course Duration : {data.registration.courseDuration}</span>
                            <span>Grade Awarded : {data.grade}</span>
                            <span>D.O.B. : {format(parseISO(data.registration.dob), 'dd-MM-yyyy')}</span>
                        </div>
                        
                        <p style={{marginTop: '5px', fontWeight: 'bold'}}>Center : EDUCATION PIXEL ONLINE TRAINING PLATFORM, PRATAPGARH</p>

                        <div style={styles.detailRow}>
                            <span>Date of Admission: {admissionDate}</span>
                            <span>Date of Issue: {format(new Date(data.issueDate), 'dd-MM-yyyy')}</span>
                        </div>
                    </div>
                </div>

                <div style={styles.footerSection}>
                    <div style={styles.signatureBlock}>
                        <div style={styles.signatureLine}>
                           {/* Verified Stamp Image Removed */}
                        </div>
                        <p style={{margin: 0}}>Verified By</p>
                    </div>
                    <div style={styles.signatureBlock}>
                        <div style={styles.signatureLine}>
                            {/* Signature Image Removed */}
                        </div>
                        <p style={{margin: 0}}>Authorised Signature</p>
                    </div>
                </div>

                <div style={styles.gradingBar}>
                    Assessment Grading: A-Excellent (75% Above), B-Good (60%-74%), C-Satisfactory (50%-59%), D-Unsatisfactory
                </div>
            </div>
             <div style={styles.footerBar}>
                 Regional Office : Bawali Mode, House Number 421 Year, Ward No 15, Near S.S. Dairy, Behror, Alwar, Rajasthan, India, 301701
                 <br />
                 www.educationpixel.com | info@educationpixel.com
             </div>
        </div>
    );
}
