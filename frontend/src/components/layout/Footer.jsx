import React from 'react';

import { useAuth } from '../../context/AuthContext.jsx';



export const Footer = () => {

  const { setCurrentPage } = useAuth();



  return (

    <footer className="mt-auto border-t border-slate-200 bg-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">

          <div>

            <span className="font-semibold text-slate-800">

              Bannari Amman Institute of Technology

            </span>

            <span className="mx-2 text-slate-300">·</span>

            <span>Autonomous Institution affiliated to Anna University</span>

            <span className="mx-2 text-slate-300">·</span>

            <span>Sathyamangalam, Erode, Tamil Nadu 638401</span>

          </div>



          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentPage('events')}
              className="hover:text-slate-800 font-semibold text-amber-700 transition-colors"
            >
              Events Catalog
            </button>

            <span className="text-slate-400">© 2026 BIT Campus Events System</span>

          </div>

        </div>

      </div>

    </footer>

  );

};
