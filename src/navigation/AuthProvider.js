import React, {createContext, useState} from 'react';
import {getPatients, getPatientsData} from '../utils/backend';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [data, setData] = useState();
  const [patientData, setPatientData] = useState();

  const fatchingData = async () => {
    try {
      const response = await getPatients();
      setData(response);
      return response;
    } catch (e) {
      console.log('Error in Fetching Data from AuthProvider : ', e);
    }
  };

  const patientsDetail = patientID => {
    try {
      const response = getPatientsData(patientID);
      setPatientData(response);
      return response;
    } catch (e) {
      console.log('Error in fetch Patients Detail from AuthProvider : ', e);
    }
  };

  const value = {
    fatchingData,
    data,
    patientsDetail,
    patientData,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
