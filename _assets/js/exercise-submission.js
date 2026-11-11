const EXERCISE_COMPLETED = `
> [!TIP|icon:fa-solid fa-check|label:Exercise completed]
> You have completed the exercise and we have verified it.
>`;

const EXERCISE_IN_REVIEW = `
> [!TIP|icon:fa-solid fa-hourglass|label:Exercise submitted]
> We are reviewing your submission!.
>`;

const EXERCISE_NOT_COMPLETED = `
> [!NOTE|icon:fa-solid fa-camera|label:Attach the screenshot]
> 
>  <form id="submit-form" class="submitForm">
>  <input type="hidden" name="workshop_ID" value="${creds.workshopID}">
>  <input type="hidden" name="exercise_ID" value="${exercise.ID}">
>  <input type="hidden" name="nomination_ID" value="${creds.ID}">
>    <label for="picture"></label>
>    <input type="file" id="picture" name="picture" accept="image/*" required multiple><br><br>
>    <textarea id="comment" name="comment" rows="4" cols="30" placeholder="Add your comment here..." required></textarea><br><br>
>    <button type="submit">Submit</button>
>  </form>
>`;

const EXERCISE_NOT_FOUND = `
> [!WARNING|label:Exercise code not found]
> Contact the trainer.
>`;

function parseExercise(full, first, creds) {
  const exerciseCode = first;
  // Find the exercise in the array
  const exercise = creds.exerciseList.find(ex => ex.code === exerciseCode);
  
  // Step 4: Check if the exercise is completed
  if (!exercise) {
    console.error(`Exercise not found ${exerciseCode}`)
    return EXERCISE_NOT_FOUND
  }

  if (exercise.completed === true) {
    return EXERCISE_COMPLETED;
  } else if (exercise.inProcess === true) {
    return EXERCISE_IN_REVIEW;
  } else {
    return EXERCISE_NOT_COMPLETED;
  }
}