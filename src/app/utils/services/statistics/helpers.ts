// //? HANDLE PIE CHART DATA
// handlePieChartData() {
//   const shiftsToFilter = structuredClone(this.userShifts);

//   const dataForChart: { [key: string]: number } = {};

//   shiftsToFilter.map((shift: Shift) => {
//     if (dataForChart[shift.workplace]) {
//       dataForChart[shift.workplace] += Number(shift.shiftRevenue);
//     } else {
//       dataForChart[shift.workplace] = Number(shift.shiftRevenue);
//     }
//   });

//   const sortedData = Object.entries(dataForChart)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 5);

//   this.pieChartData.labels = sortedData.map((item) => item[0]);
//   this.pieChartData.datasets[0].data = sortedData.map((item) => item[1]);
//   this.pieChart.updateChart();
// }

// //? HANDLE BAR CHART DATA
// async handleBarChartData() {
//   const arr: number[] = new Array(10).fill(0);
//   //prettier-ignore
//   const months = [
//     "january","february","march","april","may","june","july",
//     "august", "september", "october", "november", "december"
//   ];

//   try {
//     // fetch data for chart
//     const fetchData = async (month: string) => {
//       const queryOptions = {
//         month: '',
//         year: '',
//         collectionName: firestoreConfig.dev.shiftsDB,
//         collectionPath: [new Date().getFullYear().toString(), month],
//         queryName: 'userID',
//         queryValue: this.loggedUserID,
//         itemToQuery: 'shiftRevenue',
//       };

//       const data = await this.aggQueries.getFirebaseSum(queryOptions);
//       const indexOfMonth = months.indexOf(month);

//       if (data) {
//         arr.splice(indexOfMonth, 1, data);
//       }
//     };
//     const fetchDataPromises = months.map((month) => fetchData(month));
//     await Promise.all(fetchDataPromises);
//   } catch (error) {
//     console.log(error);
//   } finally {
//     // update chart
//     this.barChartData.labels = months.map(
//       (month) => month.charAt(0).toUpperCase() + month.slice(1)
//     );
//     this.barChartData.datasets[0].data = arr;
//     this.barChart.updateChart();
//   }
// }

// //? HANDLE LINE CHART DATA
// async handleLineChartData() {
//   const arr: number[] = new Array(10).fill(0);
//   //prettier-ignore
//   const months = [
//     "january","february","march","april","may","june","july",
//     "august", "september", "october", "november", "december"
//   ];

//   try {
//     // fetch data for chart
//     const fetchData = async (month: string) => {
//       const queryOptions = {
//         month: '',
//         year: '',
//         collectionName: 'shiftAppShifts',
//         collectionPath: [new Date().getFullYear().toString(), month],
//         queryName: 'userID',
//         queryValue: this.loggedUserID,
//         itemToQuery: '',
//       };

//       const data = await this.aggQueries.getFirebaseCount(queryOptions);
//       const indexOfMonth = months.indexOf(month);

//       if (data) {
//         arr.splice(indexOfMonth, 1, data);
//       }
//     };
//     const fetchDataPromises = months.map((month) => fetchData(month));
//     await Promise.all(fetchDataPromises);
//   } catch (error) {
//     console.log(error);
//   } finally {
//     // update chart
//     this.lineChartData.labels = months.map(
//       (month) => month.charAt(0).toUpperCase() + month.slice(1)
//     );
//     this.lineChartData.datasets[0].data = arr;
//     this.shiftsCountData[0].value = arr.reduce((a, b) => a + b, 0);
//     this.shiftsCountData[1].value = arr[new Date().getMonth()];
//     this.lineChart.updateChart();
//   }
// }

// //? HANDLE POLAR AREA CHART DATA
// handlePolarAreaChartData() {
//   const shiftsToFilter = structuredClone(this.userShifts);
//   const reducedShifts: { [key: string]: number | string }[] = [];
//   const dataForChart: { [key: string]: number } = {};

//   // extracting wage, revenue and workplace from each shift
//   shiftsToFilter.map((shift: Shift) => {
//     reducedShifts.push({
//       wage: shift.wagePerHour,
//       revenue: shift.shiftRevenue,
//       workplace: shift.workplace,
//     });
//   });

//   // calculationg worked hours per workplace
//   reducedShifts.map((shift) => {
//     const hours: number = Math.trunc(
//       Number(shift.revenue) / Number(shift.wage)
//     );
//     if (dataForChart[shift.workplace]) {
//       dataForChart[shift.workplace] += hours;
//     } else {
//       dataForChart[shift.workplace] = hours;
//     }
//   });

//   const sortedData = Object.entries(dataForChart)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 5);

//   this.polarAreaChartData.labels = sortedData.map((item) => item[0]);
//   this.polarAreaChartData.datasets[0].data = sortedData.map(
//     (item) => item[1]
//   );

//   this.polarArea.updateChart();
// }
