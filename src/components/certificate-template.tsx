
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
  certBannerUrl: string;
  studentPhotoUrl: string;
}

export default function CertificateTemplate(data: CertificateData) {
    const styles: { [key: string]: React.CSSProperties } = {
        page: {
            width: '1123px',
            height: '794px',
            boxSizing: 'border-box',
            fontFamily: '"Arial", sans-serif',
            color: '#000',
            position: 'relative',
            backgroundColor: '#fff1e1', // Light cream background
            overflow: 'hidden',
        },
        borderLeft: {
            position: 'absolute', top: 0, left: 0, width: '40px', height: '100%', 
            background: 'linear-gradient(to bottom, #7b2a2a, #a94442)',
        },
        borderRight: {
            position: 'absolute', top: 0, right: 0, width: '40px', height: '100%',
            background: 'linear-gradient(to bottom, #7b2a2a, #a94442)',
        },
        curveLeft: {
            position: 'absolute', left: '40px', top: '0', height: '100%', width: '100px'
        },
        curveRight: {
            position: 'absolute', right: '40px', top: '0', height: '100%', width: '100px', transform: 'scaleX(-1)'
        },
        content: {
            padding: '20px 160px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        },
        header: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            paddingBottom: '10px', borderBottom: '2px solid #a94442'
        },
        logo: { width: '100px', height: '100px' },
        instituteDetails: {
            textAlign: 'center', color: '#9a2526', flexGrow: 1, padding: '0 20px'
        },
        instituteName: { fontSize: '44px', fontWeight: 'bold', fontFamily: 'serif', letterSpacing: '2px' },
        tagline: { fontSize: '16px', fontWeight: 'bold', fontStyle: 'italic', margin: '5px 0' },
        subHeading: { fontSize: '9px', margin: 0, lineHeight: '1.2' },
        
        infoAndPhoto: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '10px'
        },
        regDetails: { fontSize: '14px', fontWeight: 'bold', lineHeight: 1.8 },
        studentPhoto: { width: '100px', height: '120px', border: '3px solid #213967', objectFit: 'cover' },
        
        mainBody: {
            textAlign: 'center', marginTop: '10px', flexGrow: 1
        },
        certBanner: { width: '250px', margin: '5px 0' },
        
        studentInfo: {
            textAlign: 'left', fontSize: '15px', lineHeight: 1.9, width: '100%',
            marginTop: '20px'
        },
        detailRow: {
            display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5px',
            fontSize: '14px', fontWeight: 'bold'
        },

        footerSection: {
            display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
            width: '100%', padding: '10px 0 0 0', borderTop: '2px solid #a94442', marginTop: 'auto'
        },
        signatureBlock: { textAlign: 'center', width: '180px', fontSize: '14px', fontWeight: 'bold' },
        signatureLine: { borderBottom: '1px solid black', paddingBottom: '30px', marginBottom: '5px' },
        
        gradingBar: {
            backgroundColor: '#d9534f', color: 'white', fontSize: '10px', fontWeight: 'bold',
            textAlign: 'center', padding: '3px', borderRadius: '5px', width: '100%', margin: '15px 0'
        },
        
        footerBar: {
            position: 'absolute', bottom: 0, left: 0, width: '100%',
            backgroundColor: '#213967', color: 'white', textAlign: 'center',
            fontSize: '11px', padding: '5px 0'
        }
    };
    
    const admissionDate = data.registration.registeredAt?.toDate ? format(data.registration.registeredAt.toDate(), 'dd-MM-yyyy') : format(new Date(data.examDate), 'dd-MM-yyyy');

    return (
        <div style={styles.page}>
            <div style={styles.borderLeft}></div>
            <div style={styles.borderRight}></div>
            <img src="https://res.cloudinary.com/dqycipmr0/image/upload/v1766898495/cert-curve-left_jwqfxq.png" style={styles.curveLeft} alt="Decorative Curve"/>
            <img src="https://res.cloudinary.com/dqycipmr0/image/upload/v1766898495/cert-curve-left_jwqfxq.png" style={styles.curveRight} alt="Decorative Curve"/>

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

                <div style={styles.infoAndPhoto}>
                    <div style={styles.regDetails}>
                        <p>Regd. No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {data.registration.registrationNumber}</p>
                        <p>Certificate No. : {data.certificateId}</p>
                    </div>
                    <img src={data.studentPhotoUrl} style={styles.studentPhoto} alt="Student Photo" />
                </div>

                <div style={styles.mainBody}>
                    <img src={data.certBannerUrl} style={styles.certBanner} alt="Certificate Banner"/>
                    <div style={styles.studentInfo}>
                        <p>We are much pleased to honour Mr./Ms./Mrs : <span style={{fontWeight: 'bold'}}>{data.studentName}</span></p>
                        <p>Son/Daughter/Wife Mr. : <span style={{fontWeight: 'bold'}}>{data.registration.fatherName}</span></p>
                        <p>Has successfully completed a course of : <span style={{fontWeight: 'bold'}}>{data.courseName.toUpperCase()}</span></p>
                        
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
                         <div style={{height: '40px'}}>{/* Spacer for signature */}</div>
                        <div style={styles.signatureLine}></div>
                        <p style={{margin: 0}}>Verified By</p>
                    </div>
                    <div style={styles.signatureBlock}>
                        <div style={{height: '40px'}}>{/* Spacer for signature */}</div>
                        <div style={styles.signatureLine}></div>
                        <p style={{margin: 0}}>Authorised Signature</p>
                    </div>
                </div>

                <div style={styles.gradingBar}>
                    Assessment Grading: A-Excellent (75% Above), B-Good (60%), C-Satisfactory (50%), D-Defaulter
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
