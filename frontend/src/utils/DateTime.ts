
import moment from 'moment';

// Combines date and 12-hour time string into MySQL datetime format
const formatDateTime = (date: string, time: string): string => {
  const parsedDate = moment(date);
  const [rawHour, rawMinute] = time.split(':').map(Number);
  const isPM = time.includes('PM');

  let hours = rawHour;
  if (isPM && hours !== 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;

  parsedDate.hours(hours).minutes(rawMinute);
  return parsedDate.format('YYYY-MM-DD HH:mm:ss');
};

// Combines date and time string into MySQL format manually
const combineDateTime = (dateString: string, timeString: string): string => {
  const date = new Date(dateString);
  const [time, period] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  date.setHours(hours, minutes, 0);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00:00`;
};

const getDateOnly = (datetimeString: string): string => {
  return datetimeString.split(' ')[0];
};

const formattedDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  return `${year}-${month}-${day} ${hour}:${minute} ${ampm}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${year}-${month}-${day} 00:00:00`;
};

const formatDateYear = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const calculateTotalHours = (startTime: string, endTime: string): number => {
  let [startHour, startMinute, startPeriod] = startTime.split(/:| /);
  let [endHour, endMinute, endPeriod] = endTime.split(/:| /);

  let sh = parseInt(startHour);
  let sm = parseInt(startMinute);
  let eh = parseInt(endHour);
  let em = parseInt(endMinute);

  if (startPeriod === 'PM' && sh !== 12) sh += 12;
  if (startPeriod === 'AM' && sh === 12) sh = 0;
  if (endPeriod === 'PM' && eh !== 12) eh += 12;
  if (endPeriod === 'AM' && eh === 12) eh = 0;

  let totalHours = eh - sh + (em - sm) / 60;
  if (totalHours < 0) totalHours += 24;

  return totalHours;
};

const calculateTotalDuration = (
  fromDate: string,
  fromTime: string,
  toDate: string,
  toTime: string
): number => {
  const [fromHour, fromMinute] = fromTime.slice(0, 5).split(':').map(Number);
  const fromAmPm = fromTime.slice(5).toUpperCase();
  const [toHour, toMinute] = toTime.slice(0, 5).split(':').map(Number);
  const toAmPm = toTime.slice(5).toUpperCase();

  let fh = fromHour;
  let th = toHour;
  if (fromAmPm === 'PM' && fh !== 12) fh += 12;
  if (fromAmPm === 'AM' && fh === 12) fh = 0;
  if (toAmPm === 'PM' && th !== 12) th += 12;
  if (toAmPm === 'AM' && th === 12) th = 0;

  const start = new Date(fromDate);
  const end = new Date(toDate);
  start.setHours(fh, fromMinute);
  end.setHours(th, toMinute);

  const diffMs = Math.abs(end.getTime() - start.getTime());
  return diffMs / (1000 * 60 * 60);
};

const convertToMySQLDatetime = (dateString: string, timeString: string): string => {
  const date = new Date(dateString);
  const [hours, minutes] = timeString.split(':').map(Number);
  date.setUTCHours(hours);
  date.setUTCMinutes(minutes);
  date.setUTCSeconds(0);
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

const convertToMySQLDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const separateDateAndTime = (datetimeString: string): { date: string; time: string } => {
  const date = new Date(datetimeString);
  const dateString = `${String(date.getDate()).padStart(2, '0')}/${String(
    date.getMonth() + 1
  ).padStart(2, '0')}/${date.getFullYear()}`;
  const timeString = date.toISOString().split('T')[1].split('.')[0].slice(0, -3);
  return { date: dateString, time: timeString };
};

const getYesterdayFormatted = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export {
  formatDateTime,
  combineDateTime,
  getDateOnly,
  formattedDateTime,
  formatDate,
  formatDateYear,
  calculateTotalHours,
  calculateTotalDuration,
  convertToMySQLDatetime,
  convertToMySQLDate,
  separateDateAndTime,
  getYesterdayFormatted,
  isYesterday,
  isToday,
};













// // import moment from "moment";


// // const formatDateTime = (values) => {
// //     const fromMoment = moment(values)
// //     return fromMoment.format('YYYY-MM-DD HH:mm:ss')
// // }

// // export {
// //     formatDateTime
// // }

// import moment from "moment";

// const formatDateTime = (date, time) => {
//     // Parse the date using moment
//     const parsedDate = moment(date);

//     // Extract hours, minutes, and AM/PM from the time string
//     const [hours, minutes] = time.split(":").map(part => parseInt(part)); // Split time into hours and minutes
//     const isPM = time.includes("PM"); // Check if it's PM

//     // Adjust hours for PM (if it's not 12 PM)
//     if (isPM && hours !== 12) {
//         parsedDate.add(12, "hours");
//     } else if (!isPM && hours === 12) { // Adjust hours for 12 AM
//         parsedDate.hours(0);
//     } else { // For other hours
//         parsedDate.hours(hours);
//     }

//     // Set the minutes part
//     parsedDate.minutes(minutes);

//     // Return the formatted date and time
//     return parsedDate.format("YYYY-MM-DD HH:mm:ss");
// }
// const combineDateTime = (dateString, timeString) => {
//     // Parse the date
//     const date = new Date(dateString);
//     // Parse the time
//     const [time, period] = timeString.split(" ");
//     let [hours, minutes] = time.split(":").map(Number);

//     // Adjust hours for PM time
//     if (period === "PM" && hours !== 12) {
//         hours += 12;
//     } else if (period === "AM" && hours === 12) {
//         hours = 0; // 12 AM is 0 hours
//     }

//     // Set the time components to the date object
//     date.setHours(hours, minutes);

//     // Format the combined date and time as "YYYY-MM-DD HH:mm:ss"
//     // const formattedDateTime = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
//     const formattedDateTime = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)} ${('0' + date.getHours()).slice(-2)}:00:00`;

//     return formattedDateTime;
// };

// function getDateOnly(datetimeString) {
//     // Split the datetime string by space
//     const parts = datetimeString.split(" ");
//     // Take the first part, which represents the date
//     const dateOnly = parts[0];
//     return dateOnly;
// }

// const formattedDateTime = (dateTimeString) => {
//     const date = new Date(dateTimeString);
//     const year = date.getFullYear();
//     const month = ('0' + (date.getMonth() + 1)).slice(-2);
//     const day = ('0' + date.getDate()).slice(-2);
//     const hour = ('0' + date.getHours()).slice(-2);
//     const minute = ('0' + date.getMinutes()).slice(-2);
//     const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

//     return `${year}-${month}-${day} ${hour}:${minute} ${ampm}`;
// };

// const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = ('0' + date.getDate()).slice(-2);
//     const month = ('0' + (date.getMonth() + 1)).slice(-2);
//     const year = date.getFullYear().toString().slice(-2);
//     // return `${day}-${month}-${year}`;
//     return `${year}-${month}-${day} 00:00:00`;
// };

// const formatDateYear = (dateString) => {
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     let month = date.getMonth() + 1; // Months are zero-based, so we add 1
//     month = month < 10 ? `0${month}` : month; // Ensure month is two digits
//     let day = date.getDate();
//     day = day < 10 ? `0${day}` : day; // Ensure day is two digits
//     return `${year}-${month}-${day}`;
// };

// function calculateTotalHours(startTime, endTime) {
//     // Parse start time
//     let [startHour, startMinute, startPeriod] = startTime.split(/:| /);
//     startHour = parseInt(startHour);
//     startMinute = parseInt(startMinute);

//     // Parse end time
//     let [endHour, endMinute, endPeriod] = endTime.split(/:| /);
//     endHour = parseInt(endHour);
//     endMinute = parseInt(endMinute);

//     // Convert start and end periods to 24-hour format
//     if (startPeriod === "PM" && startHour !== 12) {
//         startHour += 12;
//     }
//     if (endPeriod === "PM" && endHour !== 12) {
//         endHour += 12;
//     } else if (endPeriod === "AM" && endHour === 12) {
//         endHour = 0; // Midnight is 0 hours
//     }

//     // Calculate the total hours
//     let totalHours = endHour - startHour;

//     if (endMinute < startMinute) {
//         totalHours--; // Subtract 1 hour if end minutes are less than start minutes
//         endMinute += 60; // Adjust minutes by adding 60
//     }

//     totalHours += (endMinute - startMinute) / 60; // Add fractional hours for minutes difference

//     // If the total hours is negative, add 24 hours to account for cases where end time is on the next day
//     if (totalHours < 0) {
//         totalHours += 24;
//     }

//     return totalHours;
// }

// // function calculateTotalHours(startTime, endTime) {
// //     // Parse start time
// //     let [startHour, startMinute, startPeriod] = startTime.split(/:| /);
// //     startHour = parseInt(startHour);
// //     startMinute = parseInt(startMinute);

// //     // Parse end time
// //     let [endHour, endMinute, endPeriod] = endTime.split(/:| /);
// //     endHour = parseInt(endHour);
// //     endMinute = parseInt(endMinute);

// //     // Convert start and end periods to 24-hour format
// //     if (startPeriod === "PM" && startHour !== 12) {
// //         startHour += 12;
// //     }
// //     if (endPeriod === "PM" && endHour !== 12) {
// //         endHour += 12;
// //     } else if (endPeriod === "AM" && endHour === 12) {
// //         endHour = 0; // Midnight is 0 hours
// //     }

// //     // Calculate the total hours
// //     let totalHours = endHour - startHour;
// //     if (totalHours < 0) {
// //         totalHours += 24; // Add 24 hours for cases where end time is on the next day
// //     }

// //     // Adjust minutes
// //     if (endMinute < startMinute) {
// //         totalHours--; // Subtract 1 hour if end minutes are less than start minutes
// //     } else if (endMinute > startMinute) {
// //         totalHours += (endMinute - startMinute) / 60; // Add fractional hours for minutes difference
// //     }

// //     return totalHours;
// // }

// const calculateTotalDuration = (fromDate, fromTime, toDate, toTime) => {
//     console.log("Input Values:", fromDate, fromTime, toDate, toTime);

//     // Parse fromDate
//     const fromDateArr = fromDate.split('-');
//     const fromYear = parseInt(fromDateArr[0], 10);
//     const fromMonth = parseInt(fromDateArr[1], 10) - 1; // Months are zero-indexed
//     const fromDay = parseInt(fromDateArr[2], 10);

//     // Parse fromTime
//     let fromHours = parseInt(fromTime.substring(0, 2), 10);
//     const fromMinutes = parseInt(fromTime.substring(3, 5), 10);
//     const fromAmPm = fromTime.substring(5).toUpperCase();

//     // Adjust hours for AM/PM
//     if (fromAmPm === 'PM' && fromHours !== 12) {
//         fromHours += 12; // Add 12 hours for PM times (except for 12:00PM)
//     } else if (fromAmPm === 'AM' && fromHours === 12) {
//         fromHours = 0; // 12:00AM is equivalent to 0:00
//     }

//     // Parse toDate
//     const toDateArr = toDate.split('-');
//     const toYear = parseInt(toDateArr[0], 10);
//     const toMonth = parseInt(toDateArr[1], 10) - 1; // Months are zero-indexed
//     const toDay = parseInt(toDateArr[2], 10);

//     // Parse toTime
//     let toHours = parseInt(toTime.substring(0, 2), 10);
//     const toMinutes = parseInt(toTime.substring(3, 5), 10);
//     const toAmPm = toTime.substring(5).toUpperCase();

//     // Adjust hours for AM/PM
//     if (toAmPm === 'PM' && toHours !== 12) {
//         toHours += 12; // Add 12 hours for PM times (except for 12:00PM)
//     } else if (toAmPm === 'AM' && toHours === 12) {
//         toHours = 0; // 12:00AM is equivalent to 0:00
//     }

//     // Create Date objects for from and to
//     const fromDateObj = new Date(fromYear, fromMonth, fromDay, fromHours, fromMinutes);
//     const toDateObj = new Date(toYear, toMonth, toDay, toHours, toMinutes);

//     // Calculate the difference in milliseconds
//     let differenceInMs = Math.abs(toDateObj - fromDateObj);

//     // Convert milliseconds to hours
//     const totalHours = differenceInMs / (1000 * 60 * 60);

//     return totalHours;
// };

// function convertToMySQLDatetime(dateString, timeString) {
//     // Parse the date and time strings
//     const date = new Date(dateString);
//     const timeParts = timeString.split(':');
//     const hours = parseInt(timeParts[0], 10);
//     const minutes = parseInt(timeParts[1], 10);

//     // Adjust the date object to the specified time
//     date.setUTCHours(hours);
//     date.setUTCMinutes(minutes);
//     date.setUTCSeconds(0); // Optional, depending on your requirements

//     // Format the date object into a MySQL-compatible datetime string
//     const formattedDatetime = date.toISOString().slice(0, 19).replace('T', ' ');

//     return formattedDatetime;
// }


// // const convertToMySQLDatetime = (dateString, timeString) => {
// //     // Split the date and time string
// //     const [datePart, timePart] = dateString.split(' ');
// //     // Split the date into its components
// //     const [day, month, year] = datePart.split('-').map(part => parseInt(part));

// //     // Extract hours and minutes from the time string
// //     const [hours, minutes] = timeString.split(':').map(part => parseInt(part));

// //     // Convert 12-hour time format to 24-hour time format
// //     let hour24 = hours;
// //     if (timeString.includes('AM') && hours === 12) {
// //         hour24 = 0;
// //     } else if (timeString.includes('PM') && hours !== 12) {
// //         hour24 += 12;
// //     }

// //     // Format the date and time according to MySQL format
// //     const formattedDate = `20${year}-${month}-${day}`;
// //     const formattedTime = `${hour24}:${minutes}:00`;

// //     return `${formattedDate} ${formattedTime}`;
// // };

// const convertToMySQLDate = (date) => {
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');
//     const hours = date.getHours().toString().padStart(2, '0');
//     const minutes = date.getMinutes().toString().padStart(2, '0');
//     const seconds = date.getSeconds().toString().padStart(2, '0');
//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// };

// function separateDateAndTime(datetimeString) {
//     const date = new Date(datetimeString);

//     // Separate date and time
//     const dateString = `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
//     const timeString = date.toISOString().split('T')[1].split('.')[0].slice(0, -3);

//     return { date: dateString, time: timeString };
// }
// const getYesterdayFormatted = () => {
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);

//     const year = yesterday.getFullYear();
//     const month = yesterday.getMonth() + 1; // Month is zero-based, so add 1 to get the actual month
//     const day = yesterday.getDate();

//     const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day
//         }`;
//     return formattedDate;
// }

// // Function to check if a date is yesterday
// const isYesterday = (date) => {
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);
//     return (
//         date.getDate() === yesterday.getDate() &&
//         date.getMonth() === yesterday.getMonth() &&
//         date.getFullYear() === yesterday.getFullYear()
//     );
// };

// const isToday = (date) => {
//     const today = new Date();
//     return (
//         date.getDate() === today.getDate() &&
//         date.getMonth() === today.getMonth() &&
//         date.getFullYear() === today.getFullYear()
//     );
// };

// export {
//     calculateTotalDuration,
//     calculateTotalHours,
//     formatDate,
//     formatDateTime,
//     combineDateTime,
//     formattedDateTime, separateDateAndTime, getDateOnly, getYesterdayFormatted, isYesterday, isToday,
//     formatDateYear, convertToMySQLDatetime, convertToMySQLDate
// }
