
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
  sealUrl: string;
  partnerLogos: {
    gov: string;
    iso: string;
    msme: string;
    niti: string;
    startup: string;
  }
  qrCodeUrl?: string;
}

export default function CertificateTemplate(data: CertificateData) {
    const styles: { [key: string]: React.CSSProperties } = {
      certContainer: {
        width: '1000px',
        height: '700px',
        background: '#fff',
        position: 'relative',
        padding: '40px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        boxShadow: '0 0 30px rgba(0,0,0,0.2)',
        fontFamily: 'Roboto, sans-serif',
      },
      swooshTopLeft: {
        position: 'absolute',
        top: '-80px',
        left: '-80px',
        width: '300px',
        height: '300px',
        background: '#7b1113',
        borderRadius: '50%',
        zIndex: 1,
      },
      swooshTopLeftAfter: {
        content: '""',
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '300px',
        height: '300px',
        background: '#f9e4b7',
        borderRadius: '50%',
        zIndex: -1,
      },
      swooshBottomRight: {
        position: 'absolute',
        bottom: '-80px',
        right: '-80px',
        width: '300px',
        height: '300px',
        background: '#7b1113',
        borderRadius: '50%',
        zIndex: 1,
      },
      innerGoldBorder: {
        position: 'absolute',
        top: '15px',
        left: '15px',
        right: '15px',
        bottom: '15px',
        border: '3px solid #d4af37',
        pointerEvents: 'none',
        zIndex: 2,
      },
      header: {
        display: 'flex',
        position: 'relative',
        zIndex: 3,
        marginBottom: '10px',
      },
      logoContainer: {
        width: '120px',
      },
      logo: {
        width: '100px',
        height: '100px',
        background: 'white',
        borderRadius: '50%',
        padding: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      },
      titleArea: {
        flex: 1,
        textAlign: 'center',
      },
      mainTitle: {
        fontFamily: "'Bree Serif', serif",
        color: '#d32f2f',
        fontSize: '48px',
        margin: 0,
        letterSpacing: '1px',
        textShadow: '1px 1px 0px #000',
        textTransform: 'uppercase'
      },
      tagline: {
        fontFamily: "'Dancing Script', cursive",
        color: '#1a237e',
        fontSize: '28px',
        margin: '-10px 0 5px 0',
        textAlign: 'right',
        paddingRight: '50px',
      },
      headerSubtext: {
        fontSize: '9px',
        lineHeight: 1.3,
        color: '#000',
        fontWeight: 'bold',
      },
      cin: { color: '#d32f2f', margin: '2px 0' },
      metaRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 3,
        marginTop: '10px',
      },
      regDetails: {
        fontSize: '14px',
        color: '#1a237e',
      },
      certBadge: {
        background: 'linear-gradient(to bottom, #1e4a9e, #0a2a66)',
        color: 'white',
        padding: '12px 50px',
        fontSize: '26px',
        fontWeight: 'bold',
        fontStyle: 'italic',
        border: '2px solid #d4af37',
        borderRadius: '4px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      },
      photoBox: {
        width: '100px',
        height: '120px',
        border: '2px solid #000',
        overflow: 'hidden',
      },
      photoBoxImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      },
      contentSection: {
        position: 'relative',
        zIndex: 3,
        marginTop: '20px',
        color: '#000',
      },
      line: {
        fontSize: '18px',
        margin: '15px 0',
        fontWeight: 'bold',
      },
      val: {
        color: '#1a237e',
        textTransform: 'uppercase',
        paddingLeft: '10px',
        fontSize: '20px',
      },
      infoGrid: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '20px 0',
        fontSize: '17px',
      },
      valSmall: { color: '#1a237e', fontWeight: 'bold' },
      dateRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
        fontSize: '18px',
        color: '#000',
      },
      footerSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        position: 'relative',
        zIndex: 3,
        marginTop: '20px',
      },
      qrArea: { textAlign: 'center' },
      qrAreaImg: { width: '80px', height: '80px' },
      qrAreaP: { fontSize: '11px', marginTop: '5px', fontWeight: 'bold' },
      sigs: { display: 'flex', gap: '60px' },
      sigItem: { textAlign: 'center', width: '160px' },
      seal: { width: '70px', marginBottom: '-10px' },
      sigLine: { borderTop: '1px solid #000', marginTop: '40px', marginBottom: '5px' },
      sigItemP: { fontSize: '14px', fontWeight: 'bold', color: '#1a237e' },
      gradingBar: {
        background: '#d32f2f',
        color: 'white',
        fontSize: '11px',
        textAlign: 'center',
        padding: '4px',
        margin: '15px 0',
        position: 'relative',
        zIndex: 3,
        fontWeight: 'bold',
      },
      partnerStrip: {
        display: 'flex',
        justifyContent: 'center',
        gap: '25px',
        position: 'relative',
        zIndex: 3,
      },
      partnerStripImg: { height: '35px' },
      bottomAddress: {
        textAlign: 'center',
        fontSize: '10px',
        marginTop: '10px',
        position: 'relative',
        zIndex: 3,
        fontWeight: 'bold',
      },
      bottomAddressP: { margin: '2px 0' },
    }

    return (
        <div style={styles.certContainer}>
          <div style={styles.swooshTopLeft}><div style={styles.swooshTopLeftAfter}></div></div>
          <div style={styles.swooshBottomRight}></div>
          <div style={styles.innerGoldBorder}></div>

          <div style={styles.header}>
            <div style={styles.logoContainer}>
              <img src={data.logoUrl} alt="Logo" style={styles.logo} />
            </div>
            <div style={styles.titleArea}>
              <h1 style={styles.mainTitle}>EDUCATION PIXEL</h1>
              <p style={styles.tagline}>Learn focus & Grow</p>
              <div style={styles.headerSubtext}>
                <p>Run under: AROGYA JEEVAN SOCIAL HEALTHCARE FOUNDATION</p>
                <p>Reg. by: Ministry of Corporate Affairs [Govt. of India] sub-section (2) of section 7 and sub-section (1)</p>
                <p>of section 8 of the Companies Act, 2013 (18 of 2013) and rule 18 of the Companies [Incorporation] Rules, 2014]</p>
                <p style={styles.cin}>CIN-U85300BR2022NPL055558</p>
                <p style={styles.cin as React.CSSProperties}>Regd. NITI Aayog Unique ID: BR/2022/0304927</p>
                <p style={styles.cin as React.CSSProperties}>(AN ISO 9001:2015 Certified)</p>
              </div>
            </div>
          </div>

          <div style={styles.metaRow}>
            <div style={styles.regDetails}>
              <p><strong>Regd. No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {data.registration.registrationNumber}</strong></p>
              <p><strong>Certificate No. &nbsp;: {data.certificateId}</strong></p>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={styles.certBadge}>CERTIFICATE</div>
            </div>
            <div style={styles.photoBox}>
              <img src={data.studentPhotoUrl} alt="Student" style={styles.photoBoxImg} />
            </div>
          </div>

          <div style={styles.contentSection}>
            <p style={styles.line}>We are much pleased to honour Mr./Ms./Mrs : <span style={styles.val}>{data.studentName}</span></p>
            <p style={styles.line}>Son/Daughter/Wife Mr. : <span style={styles.val}>{data.registration.fatherName}</span></p>
            <p style={styles.line}>Has successfully completed a course of : <span style={styles.val}>{data.courseName}</span></p>
            
            <div style={styles.infoGrid}>
              <p><strong>Course Duration :</strong> <span style={styles.valSmall}>{data.registration.courseDuration}</span></p>
              <p><strong>Grade Awarded :</strong> <span style={styles.valSmall}>{data.grade}</span></p>
              <p><strong>D.O.B.:</strong> <span style={styles.valSmall}>{format(parseISO(data.registration.dob), 'dd-MM-yyyy')}</span></p>
            </div>

            <p style={styles.line}><strong>Center :</strong> <span style={styles.val}>EDUCATION PIXEL ONLINE TRAINING PLATFORM, PRATAPGARH</span></p>
            
            <div style={styles.dateRow}>
              <p><strong>Date of Admission:</strong> {format(new Date(data.registration.registeredAt.seconds * 1000), 'dd-MM-yyyy')}</p>
              <p><strong>Date of Issue:</strong> {format(new Date(data.issueDate), 'dd-MM-yyyy')}</p>
            </div>
          </div>

          <div style={styles.footerSection}>
            <div style={styles.qrArea}>
              {data.qrCodeUrl && <img src={data.qrCodeUrl} alt="QR" style={styles.qrAreaImg} />}
              <p style={styles.qrAreaP}>Scan to Verify</p>
            </div>
            
            <div style={styles.sigs}>
              <div style={styles.sigItem}>
                <img src={data.sealUrl} style={styles.seal} />
                <p style={styles.sigItemP}>Verified By :</p>
              </div>
              <div style={styles.sigItem}>
                <div style={styles.sigLine}></div>
                <p style={styles.sigItemP}>Authorised Signature</p>
              </div>
            </div>
          </div>

          <div style={styles.gradingBar}>
            Assessment Grading-A-Excellent (75% Above), B-Good (75%-50%), C-Satisfactory (50%-30%), D-Below
          </div>

          <div style={styles.partnerStrip}>
            <img src={data.partnerLogos.gov} style={styles.partnerStripImg} />
            <img src={data.partnerLogos.iso} style={styles.partnerStripImg} />
            <img src={data.partnerLogos.msme} style={styles.partnerStripImg} />
            <img src={data.partnerLogos.niti} style={styles.partnerStripImg} />
            <img src={data.partnerLogos.startup} style={styles.partnerStripImg} />
          </div>

          <div style={styles.bottomAddress}>
            <p style={styles.bottomAddressP}>Registered Office : Nawab House, House number 431 Near by S. R. Dairy, Haldoni Greater Noida (UP) Pin Code- 201308</p>
            <p style={styles.bottomAddressP}>🌐 www.educationpixel.com &nbsp;&nbsp; ✉ ashishkumargiri51@gmail.com</p>
          </div>
        </div>
    );
}

