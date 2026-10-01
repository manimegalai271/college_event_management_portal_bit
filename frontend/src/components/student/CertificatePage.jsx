import React, { useState, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext.jsx';

import { apiService } from '../../services/api.js';

import { Award, Printer, ShieldCheck } from 'lucide-react';



export const CertificatePage = () => {

  const { user, setCurrentPage } = useAuth();

  const [certificates, setCertificates] = useState([]);

  const [selectedCert, setSelectedCert] = useState(null);



  useEffect(() => {

    const loadCerts = async () => {

      if (!user) return;

      const certs = await apiService.getUserCertificates(user.id);

      setCertificates(certs);

      if (certs.length > 0 && !selectedCert) {

        setSelectedCert(certs[0]);

      }

    };

    loadCerts();

  }, [user]);



  const handlePrint = () => {

    window.print();

  };



  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">

            Participation & Achievement Certificates

          </h1>

          <p className="text-xs text-slate-500 mt-1">

            Digitally verified certificates issued by Bannari Amman Institute of Technology for completed events.

          </p>

        </div>



        {selectedCert && (

          <button

            onClick={handlePrint}

            className="self-start sm:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"

          >

            <Printer className="w-4 h-4" />

            Print / Save as PDF

          </button>

        )}

      </div>



      {certificates.length === 0 ? (

        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto">

          <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />

          <h3 className="text-base font-bold text-slate-800">No Certificates Issued Yet</h3>

          <p className="text-xs text-slate-500 mt-1 mb-5">

            Certificates are issued automatically once an event concludes, attendance is verified, and student feedback is received.

          </p>

          <button

            onClick={() => setCurrentPage('my-registrations')}

            className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"

          >

            Check Registered Events

          </button>

        </div>

      ) : (

        <div className="space-y-6">

          {certificates.length > 1 && (

            <div className="flex items-center gap-2 overflow-x-auto pb-2">

              {certificates.map(cert => (

                <button

                  key={cert.id}

                  onClick={() => setSelectedCert(cert)}

                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${

                    selectedCert?.id === cert.id

                      ? 'bg-amber-50 text-amber-900 border-amber-500 shadow-sm'

                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'

                  }`}

                >

                  {cert.eventTitle}

                </button>

              ))}

            </div>

          )}



          {selectedCert && (

            <div className="bg-slate-100 p-4 sm:p-8 rounded-2xl border border-slate-200 flex justify-center">

              <div

                id="printable-certificate"

                className="w-full max-w-4xl bg-white rounded-xl shadow-xl border-8 border-double border-amber-700 p-8 sm:p-14 relative text-center text-slate-800 overflow-hidden"

                style={{

                  backgroundImage:

                    'radial-gradient(circle at center, rgba(254, 243, 199, 0.15) 0%, rgba(255, 255, 255, 1) 70%)',

                }}

              >

                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-700 pointer-events-none" />

                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-700 pointer-events-none" />

                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-700 pointer-events-none" />

                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-700 pointer-events-none" />



                <div className="flex justify-center mb-4">

                  <div className="w-16 h-16 rounded-full border-2 border-amber-700 p-1 flex items-center justify-center bg-amber-50">

                    <div className="w-13 h-13 rounded-full bg-amber-700 text-white flex flex-col items-center justify-center">

                      <span className="font-serif font-black text-lg tracking-wider">BIT</span>

                      <span className="text-[7px] uppercase tracking-widest font-mono">1996</span>

                    </div>

                  </div>

                </div>



                <div className="space-y-1 mb-6">

                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-amber-950 uppercase tracking-widest">

                    {selectedCert.collegeName}

                  </h2>

                  <p className="text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider font-medium">

                    (An Autonomous Institution Affiliated to Anna University, Chennai · Approved by AICTE)

                  </p>

                  <p className="text-[10px] text-slate-400">

                    Sathyamangalam, Erode District, Tamil Nadu – 638 401

                  </p>

                </div>



                <div className="my-6">

                  <span className="inline-block py-1.5 px-6 border-b-2 border-amber-700 text-sm sm:text-base font-serif font-bold tracking-widest text-slate-900 uppercase">

                    Certificate of Participation

                  </span>

                </div>



                <div className="max-w-2xl mx-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">

                  <p>This is to proudly certify that</p>



                  <div className="py-1">

                    <span className="text-lg sm:text-xl md:text-2xl font-sans font-bold text-slate-900 border-b border-slate-400 px-4 inline-block">

                      {selectedCert.studentName}

                    </span>

                  </div>



                  <p className="text-xs text-slate-600">

                    Roll No: <span className="font-mono font-semibold text-slate-800">{selectedCert.studentRollNumber}</span>{' '}

                    · {selectedCert.studentDepartment}

                  </p>



                  <p>

                    has actively participated in the campus technical event{' '}

                    <strong className="text-slate-950 block text-base font-sans sm:text-lg mt-1 font-semibold">

                      &ldquo;{selectedCert.eventTitle}&rdquo;

                    </strong>

                  </p>



                  <p className="text-xs text-slate-600">

                    conducted at Bannari Amman Institute of Technology on{' '}

                    <strong className="font-sans font-semibold text-slate-800">{selectedCert.eventDate}</strong>.

                  </p>

                </div>



                <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 items-end text-xs">

                  <div className="text-left space-y-1">

                    <div className="text-[10px] text-slate-400 uppercase font-semibold">

                      Certificate ID

                    </div>

                    <div className="font-mono font-bold text-[11px] text-slate-700">

                      {selectedCert.certificateNumber}

                    </div>

                    <div className="text-[10px] text-slate-400">Issued: {selectedCert.issueDate}</div>

                  </div>



                  <div className="text-center space-y-1">

                    <div className="h-8 flex items-center justify-center font-serif italic text-slate-700 text-sm">

                      K. Saravanan

                    </div>

                    <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800 text-[11px]">

                      {selectedCert.signatory1}

                    </div>

                  </div>



                  <div className="col-span-2 sm:col-span-1 text-center space-y-1">

                    <div className="h-8 flex items-center justify-center font-serif italic text-slate-700 text-sm">

                      C. Palanisamy

                    </div>

                    <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800 text-[11px]">

                      {selectedCert.signatory2}

                    </div>

                  </div>

                </div>



                <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-widest font-mono">

                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />

                  Verified BIT Academic Credential

                </div>

              </div>

            </div>

          )}

        </div>

      )}

    </div>

  );

};
