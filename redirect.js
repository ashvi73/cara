window.addEventListener("load", () => {
  const currentURL = window.location.href;

  if (currentURL.includes("cmd=login")) return;

  if (currentURL.includes("/psp/ps/?")) {
    chrome.storage.local.get(["shouldRedirect"], ({ shouldRedirect }) => {
      if (!shouldRedirect) return;

      chrome.storage.local.set({ shouldRedirect: false }, () => {
        window.location.href =
          "https://eyojan.srmu.ac.in/psp/ps/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.SSR_SSENRL_GRADE.GBL?PORTALPARAM_PTCNAV=HC_SSR_SSENRL_GRADE_GBL&EOPP.SCNode=HRMS&EOPP.SCPortal=EMPLOYEE&EOPP.SCName=ADMN_ENROLLMENT&EOPP.SCLabel=Enrollment&EOPP.SCPTcname=ADMN_SC_SP_ENROLLMENT&FolderPath=PORTAL_ROOT_OBJECT.PORTAL_BASE_DATA.CO_NAVIGATION_COLLECTIONS.ADMN_ENROLLMENT.ADMN_S202410231104354345835749&IsFolder=false";
      });
    });
  }
});
