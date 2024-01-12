// generateRandomShifts() {
//   function getRandomArbitrary(min: number, max: number) {
//     return Math.floor(Math.random() * (max - min) + min);
//   }

//   this.shiftForm.patchValue({
//     shiftID: uuidv4(),
//     shiftDate: `2023-${getRandomArbitrary(1, 13)
//       .toString()
//       .padStart(2, '0')}-${getRandomArbitrary(1, 32)
//       .toString()
//       .padStart(2, '0')}`,
//     startTime: `${getRandomArbitrary(0, 24)
//       .toString()
//       .padStart(2, '0')}:${getRandomArbitrary(0, 61)
//       .toString()
//       .padStart(2, '0')}`,
//     endTime: `${getRandomArbitrary(0, 24)
//       .toString()
//       .padStart(2, '0')}:${getRandomArbitrary(0, 61)
//       .toString()
//       .padStart(2, '0')}`,
//     workplace: `${
//       this.currentState.currentLoggedFireUser?.userWorkplaces[
//         getRandomArbitrary(
//           0,
//           this.currentState.currentLoggedFireUser?.userWorkplaces.length
//         )
//       ].toLowerCase()
//     }`,
//     wagePerHour: `${getRandomArbitrary(10, 30)}`,
//     shiftRevenue: ``,
//   });

//   console.log(this.shiftForm.value);
//   this.calculateRevenue();

//   this.onSubmit();
// }

//! put this in calculate revenue
// const wage = this.shiftForm.get('wagePerHour')?.value;

//! disable redirect in onSubmit()

//! put this in onInit()
// for (let i = 0; i < 100; i++) {
//   this.generateRandomShifts();
// }
