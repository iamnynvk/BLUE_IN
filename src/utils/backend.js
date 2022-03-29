export const getPatients = async () => {
  const resposne = await fetch('http://167.71.225.187:9000/patients/');
  if (resposne.ok) {
    const {payload} = await resposne.json();
    return payload;
  } else {
    console.log('Error in getPatients : ', resposne.message);
  }
};

export const getPatientsData = async patientID => {
  const resposne = await fetch(
    `http://167.71.225.187:9000/vitals/${patientID}/C4:DD:57:6A:57:E4/`,
  );
  if (resposne.ok) {
    const {payload} = await resposne.json();
    return payload;
  } else {
    console.log('Error in getPatientsData : ', resposne.message);
  }
};
