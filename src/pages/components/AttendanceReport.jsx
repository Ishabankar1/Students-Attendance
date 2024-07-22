import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import {
  Box,
  Button,
  Container,
  FormControl,
  Select,
  Grid,
  InputLabel,
  MenuItem,
  Typography,
  CircularProgress,
  makeStyles,
  FormControlLabel
} from '@mui/material';

import { useEffect, useState } from 'react';
import { getStudents } from 'src/services/students/students.service';
import ReactApexChart from 'react-apexcharts';
// import { getAllTimetableByClassId, getSavedTimetableClassNames } from 'src/services/timetable/timetable.service';
import { getAllAttendenceData, getStudentsByClassIdAndSubjectIdByAttendenceDate } from 'src/services/Attendence/attendence.service';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
dayjs.extend(utc);
import { getClasses } from 'src/services/classes/class.service';
const Attendence = () => {
  const [classId, setClassId] = React.useState('');
  const [subjectId, setSubjectId] = React.useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [timetableClassNames, setTimetableClassNames] = useState([]);
  const [timetableByClassId, setTimetableByClassId] = useState([]);
  const [dayWiseSubjects, setDayWiseSubjects] = useState([]);
  const [allAttendenceData, setAllAttendenceData] = useState([0]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [selectedStartDate, setSelectedStartDate] = useState();
  const [selectedEndDate, setSelectedEndDate] = useState();
  const [selectedStudent, setSelectedStudent] = useState([0]);

  const [overAllResult, setOverAllResult] = useState({
    present: 0,
    absent: 0,
    emergency: 0,
    nursing: 0,
    total: 0
  });
  const [studentId, setStudentId] = useState('');
  // OverAll
  const [subjectArray, setSubjectArray] = useState([]);
  const [presentArray, setPresentArray] = useState([0]);
  const [absentArray, setAbsentArray] = useState([0]);
  const [emergencyArray, setEmergencyArray] = useState([0]);
  const [nursingArray, setNursingArray] = useState([0]);
  // StudentWise
  const [studentNameArray, setStudentNameArray] = useState([]);
  const [studentPresentArray, setStudentPresentArray] = useState([0]);
  const [studentAbsentArray, setStudentAbsentArray] = useState([0]);
  const [studentEmergencyArray, setStudentEmergencyArray] = useState([0]);
  const [studentNursingArray, setStudentNursingArray] = useState([0]);
  const [checked, setChecked] = useState(true);
  const [showCard, setShowCard] = useState(false);

  const fetchApi = async () => {
    const students = await getStudents();
    // const classesName = await getSavedTimetableClassNames();
    const getData = await getClasses();
    const getAttendenceData = await getAllAttendenceData();
    setStudentsList(students);
    console.log(getData);
    setTimetableClassNames(getData);
    setAllAttendenceData(getAttendenceData);
  };
  useEffect(() => {
    fetchApi();
  }, [classId, subjectId]);
  const filterStudentsByClassId = (studentsList, classID) => {
    return studentsList.filter((item) => item.classId._id === classID);
  };
  const handleStartDate = (date) => {
    setSelectedDate(date);
    const day = dayjs(date).format('dddd');
    if (day == 'Saturday' || day == 'Sunday') {
      enqueueSnackbar('Please select date form Monday to Friday', { variant: 'warning' });
    } else {
      const dayWiseSubjects = timetableByClassId.filter((item) => item?.day === day);
      setDayWiseSubjects(dayWiseSubjects);
    }
    setSelectedStartDate(date);
    const nextDay = date.add(1, 'day');
    const nextDate = dayjs(nextDay).toISOString();
    setStartDate(nextDate);
  };
  const handleEndDate = (date) => {
    setSelectedEndDate(date);
    const nextDay = date.add(1, 'day');
    const nextDate = dayjs(nextDay).toISOString();
    setEndDate(nextDate);
  };
  const handleClass = async (event) => {
    setClassId(event.target.value);
    // const timeatableByClassIdDetails = await getAllTimetableByClassId(event.target.value);
    // setTimetableByClassId(timeatableByClassIdDetails);
    const students = filterStudentsByClassId(studentsList, event.target.value);
    setSelectedStudent(students);
  };

  function filterDataByDateRangeAndClassId(data, startDate, endDate, classId) {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.attendenceDate);
      return itemDate >= startDateObj && itemDate <= endDateObj && item.classId._id === classId;
    });
    return filteredData;
  }

  // count and filter
  function countAttendanceTypes(data) {
    // Initialize counters for each attendance type
    let presentCount = 0;
    let absentCount = 0;
    let emergencyCount = 0;
    let nursingCount = 0;
    let totalCount = 0;
    // Iterate over the data array and count each attendance type
    data.forEach((item) => {
      switch (item.attendenceType) {
        case 'Present':
          presentCount++;
          totalCount++;
          break;
        case 'Absent':
          absentCount++;
          totalCount++;
          break;
        case 'Emergency':
          emergencyCount++;
          totalCount++;
          break;
        case 'Nursing':
          nursingCount++;
          totalCount++;
          break;
        default:
          // Handle any other types if needed
          break;
      }
    });

    // Calculate percentages
    const presentPercentage = Math.round((presentCount / totalCount) * 100);
    const absentPercentage = Math.round((absentCount / totalCount) * 100);
    const emergencyPercentage = Math.round((emergencyCount / totalCount) * 100);
    const nursingPercentage = Math.round((nursingCount / totalCount) * 100);

    return {
      present: presentPercentage,
      absent: absentPercentage,
      emergency: emergencyPercentage,
      nursing: nursingPercentage,
      total: 100
    };
  }
  function filterAndCountAttendanceSubjectWise(data) {
    const filteredData = {};
    data.forEach((item) => {
      // const subjectId = item.subjectId._id;
      const subjectId = item.subjectId.subject;
      if (!filteredData[subjectId]) {
        filteredData[subjectId] = {
          present: 0,
          absent: 0,
          emergency: 0,
          nursing: 0,
          total: 0
        };
      }
      // Count attendance types
      switch (item.attendenceType) {
        case 'Present':
          filteredData[subjectId].present++;
          filteredData[subjectId].total++;
          break;
        case 'Absent':
          filteredData[subjectId].absent++;
          filteredData[subjectId].total++;
          break;
        case 'Emergency':
          filteredData[subjectId].emergency++;
          filteredData[subjectId].total++;
          break;
        case 'Nursing':
          filteredData[subjectId].nursing++;
          filteredData[subjectId].total++;
          break;
        default:
          break;
      }
    });
    handleOverAllReport(filteredData);
    // return filteredData;
  }

  function filterAndCountAttendanceStudent(data) {
    const result = {};

    // Iterate over the data
    data.forEach((item) => {
      const studentName = item.studentId.name;
      const subjectName = item.subjectId.subject;
      const attendanceType = item.attendenceType.toLowerCase();

      // Initialize counts if not already present
      if (!result[studentName]) {
        result[studentName] = {
          present: 0,
          absent: 0,
          emergency: 0,
          nursing: 0
        };
      }

      // Update counts based on attendance type
      switch (attendanceType) {
        case 'present':
          result[studentName][attendanceType]++;
          break;
        case 'absent':
          result[studentName][attendanceType]++;
          break;
        case 'emergency':
          result[studentName][attendanceType]++;
          break;
        case 'nursing':
          result[studentName][attendanceType]++;
          break;
        default:
          break;
      }
    });
    handleStudentsReport(result);
    // return result;
  }
  const handleOverAllReport = (data) => {
    // working on report
    const Subjectkeys = Object.keys(data).filter((key) => key);
    const overAllpresentValues = Object.values(data)?.map((subject) => subject?.present);
    const overAllabsentValues = Object.values(data)?.map((subject) => subject?.absent);
    const overAllnursingValues = Object.values(data)?.map((subject) => subject?.nursing);
    const overAllemergencyValues = Object.values(data)?.map((subject) => subject?.emergency);
    setSubjectArray(Subjectkeys);
    setPresentArray(overAllpresentValues);
    setAbsentArray(overAllabsentValues);
    setNursingArray(overAllnursingValues);
    setEmergencyArray(overAllemergencyValues);
  };
  const handleStudentsReport = (data) => {
    const studentsName = Object.keys(data).filter((key) => key);
    console.log(studentsName);
    const presentValues = Object.values(data)?.map((subject) => subject?.present);
    const absentValues = Object.values(data)?.map((subject) => subject?.absent);
    const nursingValues = Object.values(data)?.map((subject) => subject?.nursing);
    const emergencyValues = Object.values(data)?.map((subject) => subject?.emergency);
    setStudentNameArray(studentsName);
    setStudentPresentArray(presentValues);
    setStudentAbsentArray(absentValues);
    setStudentEmergencyArray(nursingValues);
    setStudentNursingArray(emergencyValues);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const filteredDataWithClassId = filterDataByDateRangeAndClassId(allAttendenceData, startDate, endDate, classId);
    // count
    const PresentCount = countAttendanceTypes(filteredDataWithClassId);
    console.log(PresentCount);

    if (!Number.isNaN(PresentCount.present)) {
      setOverAllResult(PresentCount);
      setShowCard(true);
    }
    filterAndCountAttendanceSubjectWise(filteredDataWithClassId);
    filterAndCountAttendanceStudent(filteredDataWithClassId);
  };
  const ApexChartOverAll = () => {
    const [chartData, setChartData] = useState({
      series: [
        {
          name: 'Present',
          colors: ['#008ffb'],
          // data: [44, 55, 41, 37, 22, 43, 21],
          data: presentArray
        },
        {
          name: 'Emergency',
          colors: ['#feb019'],
          data: emergencyArray
        },
        {
          name: 'Nursing',
          colors: ['#00e396'],
          data: nursingArray
        },
        {
          name: 'Absent',
          colors: ['#ff4560'],
          data: absentArray
        }
      ],

      options: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          stackType: '100%'
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        title: {
          text: 'Overall Attendence Report'
        },
        xaxis: {
          categories: subjectArray
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + '  Students';
            }
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 40
        }
      }
      // colors: ['#008ffb', '#ff4560', '#00e396', '#feb019'],
    });

    return (
      <div>
        <div id="chart">
          <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  };
  const ApexChartStudentwise = () => {
    const [chartData, setChartData] = useState({
      series: [
        {
          name: 'Present',
          colors: ['#008ffb'],
          data: studentPresentArray
        },

        {
          name: 'Emergency',
          colors: ['#feb019'],

          data: studentEmergencyArray
        },
        {
          name: 'Nursing',
          colors: ['#00e396'],
          data: studentNursingArray
        },
        {
          name: 'Absent',
          colors: ['#ff4560'],
          data: studentAbsentArray
        }
      ],
      options: {
        chart: {
          type: 'bar',
          height: 900,
          stacked: true,
          stackType: '100%'
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        title: {
          text: 'Students Attendence Report'
        },
        xaxis: {
          categories: studentNameArray
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + ' Lectures';
            }
          }
        },
        fill: {
          opacity: 1,
          height: 12,
          type: 'solid'
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 40
        }
      },
      colors: ['#008ffb', '#ff4560', '#00e396', '#feb019']
    });

    return (
      <div>
        <div id="chart">
          <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={750} />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  };
  return timetableClassNames?.length === 0 ? (
    <>
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    </>
  ) : (
    <>
      <Container maxWidth={'xl'}>
        <Box
          sx={{
            position: 'relative',
            padding: '20px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="h3" component="h1" paragraph>
            Attendance Report
          </Typography>
          <Box
            sx={{
              maxWidth: '100%',
              height: '100%',
              border: '1 solid black',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ width: '100%', boxShadow: '1px 2px 3px #ccc', borderRadius: 3 }}>
              <form onSubmit={onSubmit}>
                <FormControl sx={{ width: '100%' }}>
                  <Grid container spacing={3} m={'0.2px'}>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Classname</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={classId}
                          label="Classname"
                          onChange={handleClass}
                          required
                          name="classId"
                        >
                          {timetableClassNames?.map((data) => (
                            <MenuItem key={data?._id} value={data?._id}>
                              {data?.classname}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3.2} sx={{ pt: '14px !important' }}>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={['DateTimePicker']}>
                            <DateTimePicker
                              label="Start Date "
                              name="StartDate"
                              // value={selectedDate}
                              value={selectedStartDate ?? dayjs()}
                              onChange={handleStartDate}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </FormControl>
                    </Grid>{' '}
                    <Grid item xs={3.2} sx={{ pt: '14px !important' }}>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={['DateTimePicker']}>
                            <DateTimePicker
                              label="End Date "
                              name="EndDate"
                              value={selectedEndDate ?? dayjs().add(1, 'day')}
                              onChange={handleEndDate}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </FormControl>
                    </Grid>
                    {/* <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Period Name </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={subjectId}
                          label="Period Name"
                          onChange={handleSubjectChange}
                          required
                          name="subjectId"
                        >
                          {dayWiseSubjects?.map((data) => (
                            <MenuItem key={data?._id} value={data?.subjectId?._id}>
                              {data?.subjectId?.subject}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>{' '}
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Student Name</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={studentId}
                          label="Student Name"
                          onChange={handleStudentChange}
                          required
                          name="subjectId"
                        >
                          {selectedStudent?.map((data) => (
                            <MenuItem key={data?._id} value={data?._id}>
                              {data?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid> */}
                    <Grid item xs={12}>
                      <Button variant="contained" size="medium" sx={{ float: 'right', marginRight: 6, marginBottom: 2 }} type="submit">
                        Get Report
                      </Button>
                    </Grid>
                  </Grid>
                </FormControl>
              </form>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            padding: '2% 10%'
          }}
        >
          {subjectArray?.length != 0 ? <ApexChartOverAll /> : studentNameArray?.length != 0 ? <ApexChartStudentwise /> : ''}
        </Box>
      </Container>
    </>
  );
};
export default Attendence;

// <Grid item xs={3}>
// <FormControlLabel
//   control={<Switch defaultChecked />}
//   label="OverAll"
//   onChange={() => {
//     console.log(checked);
//     setChecked(!checked);
//   }}
// />
// </Grid>
