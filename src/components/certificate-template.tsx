
import React from 'react';
import type { ExamResult, ExamRegistration } from '@/lib/types';
import { format, parseISO } from 'date-fns';

interface CertificateData extends Omit<ExamResult, 'id' | 'submittedAt' | 'responses' | 'timeTaken'> {
  registration: ExamRegistration;
  certificateId: string;
  issueDate: string;
  examDate: string;
  percentage: number;
  logoUrl: string;
  certBannerUrl: string;
  qrUrl: string;
  footerLogosUrl: string;
  studentPhotoUrl: string;
}

export default function CertificateTemplate(data: CertificateData) {

    const getGrade = (percentage: number) => {
        if (percentage >= 75) return 'A';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C';
        return 'D';
    };

    const grade = getGrade(data.percentage);

    const styles: { [key: string]: React.CSSProperties } = {
        page: {
            width: '1123px',
            height: '794px',
            boxSizing: 'border-box',
            fontFamily: '"Arial", sans-serif',
            color: '#000',
            position: 'relative',
            backgroundColor: '#fff',
            overflow: 'hidden',
        },
        borderTop: { position: 'absolute', top: 0, left: 0, width: '100%', height: '55px', backgroundColor: '#9a2526' },
        borderBottom: { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '55px', backgroundColor: '#9a2526' },
        borderLeft: { position: 'absolute', top: 0, left: 0, width: '55px', height: '100%', backgroundColor: '#213967' },
        borderRight: { position: 'absolute', top: 0, right: 0, width: '55px', height: '100%', backgroundColor: '#213967' },
        
        content: {
            position: 'absolute',
            top: '55px', left: '55px', right: '55px', bottom: '55px',
            border: '2px solid #9a2526',
            padding: '15px'
        },
        innerBorder: {
            width: '100%', height: '100%',
            border: '1px solid #213967',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        header: {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '15px 25px 0 25px',
            boxSizing: 'border-box'
        },
        logo: { width: '100px', height: '100px', borderRadius: '50%', border: '2px solid #213967' },
        instituteDetails: {
            textAlign: 'center',
            color: '#9a2526',
        },
        instituteName: { fontSize: '42px', fontWeight: 'bold', margin: '5px 0', fontFamily: 'serif' },
        subHeading: { fontSize: '11px', margin: 0 },
        studentPhoto: { width: '100px', height: '120px', border: '3px solid #213967', objectFit: 'cover'},
        regDetails: {
            position: 'absolute',
            top: '150px',
            left: '40px',
            fontSize: '12px',
            fontWeight: 'bold',
            lineHeight: 1.6
        },
        certificateBanner: { width: '250px', margin: '20px 0 15px 0'},
        mainBody: {
            width: '90%',
            textAlign: 'left',
            fontSize: '15px',
            lineHeight: 1.8,
            marginTop: '25px',
        },
        detailRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginTop: '8px'
        },
        footerSection: {
            position: 'absolute',
            bottom: '20px',
            left: '25px',
            right: '25px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
        },
        qrCode: { width: '100px', height: '100px' },
        signatureBlock: { textAlign: 'center', width: '200px' },
        footerLogos: { width: '350px', marginTop: '10px' },
        bold: { fontWeight: 'bold' }
    };
    
    return (
        <div style={styles.page}>
            <div style={styles.borderTop}></div>
            <div style={styles.borderBottom}></div>
            <div style={styles.borderLeft}></div>
            <div style={styles.borderRight}></div>

            <div style={styles.content}>
                <div style={styles.innerBorder}>
                    <div style={styles.header}>
                        <img src={data.logoUrl} style={styles.logo} alt="Institute Logo" />
                        <div style={styles.instituteDetails}>
                            <h1 style={styles.instituteName}>EDUCATION PIXEL</h1>
                            <p style={styles.subHeading}>Run under: AROGYA JEEVAN SOCIAL HEALTHCARE FOUNDATION</p>
                            <p style={styles.subHeading}>Reg by: Ministry of Corporate Affairs (Govt. of India)</p>
                            <p style={styles.subHeading}>Regd. NITI Aayog Unique ID: BR/2022/0304937 (AN ISO 9001:2015 Certified)</p>
                        </div>
                        <img src={data.studentPhotoUrl} style={styles.studentPhoto} alt="Student Photo" />
                    </div>

                    <div style={styles.regDetails}>
                        <p>Regd. No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {data.registration.registrationNumber}</p>
                        <p>Certificate No. : {data.certificateId}</p>
                    </div>

                    <img src={data.certBannerUrl} style={styles.certificateBanner} alt="Certificate Banner"/>
                    
                    <div style={styles.mainBody}>
                        <p>We are much pleased to honour Mr./Ms./Mrs: <span style={styles.bold}>{data.studentName}</span></p>
                        <p>Son/Daughter/Wife Mr. : <span style={styles.bold}>{data.registration.fatherName}</span></p>
                        <p>Has successfully completed a course of : <span style={styles.bold}>{data.courseName}</span></p>
                        
                        <div style={styles.detailRow}>
                            <span>Course Duration : <span style={styles.bold}>{data.registration.courseDuration}</span></span>
                            <span>Grade Awarded : <span style={styles.bold}>{grade}</span></span>
                            <span>D.O.B. : <span style={styles.bold}>{format(parseISO(data.registration.dob), 'dd-MM-yyyy')}</span></span>
                        </div>
                        
                        <p style={{marginTop: '8px'}}>Center : <span style={styles.bold}>EDUCATION PIXEL ONLINE TRAINING PLATFORM, PRATAPGARH</span></p>

                        <div style={styles.detailRow}>
                            <span>Date of Admission: <span style={styles.bold}>{format(data.registration.registeredAt.toDate(), 'dd-MM-yyyy')}</span></span>
                            <span>Date of Issue: <span style={styles.bold}>{format(new Date(data.issueDate), 'dd-MM-yyyy')}</span></span>
                        </div>
                    </div>

                    <div style={styles.footerSection}>
                        <div style={{textAlign: 'center'}}>
                            <img src={data.qrUrl} style={styles.qrCode} alt="QR Code" />
                            <p style={{fontSize: '10px', fontWeight: 'bold'}}>Scan to Verify</p>
                        </div>
                        <div style={styles.signatureBlock}>
                            <p style={{borderBottom: '1px solid black', paddingBottom: '30px', marginBottom: '5px'}}>&nbsp;</p>
                            <p style={{margin: 0, fontWeight: 'bold'}}>Verified By</p>
                        </div>
                        <div style={styles.signatureBlock}>
                            <p style={{borderBottom: '1px solid black', paddingBottom: '30px', marginBottom: '5px'}}>&nbsp;</p>
                            <p style={{margin: 0, fontWeight: 'bold'}}>Authorised Signature</p>
                        </div>
                    </div>

                    <img src={data.footerLogosUrl} style={{ position: 'absolute', bottom: '60px', right: '150px', width: '250px'}} alt="Footer Logos" />
                </div>
            </div>
        </div>
    );
}
