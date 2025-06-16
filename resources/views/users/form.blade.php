<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Form</title>
  <link rel="stylesheet" href="../css/form.css">
  <link rel="icon" href="../imgs/logo.png">
  <script type="module" src="../js/form.js" defer></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
</head>
<body>
  <nav id="nav-bar">
    <img src="../imgs/logo.png" alt="" id="nav-logo">
    <p id="page-title">Event Experience Evaluation</p>
    <a href="/users/profile"><img src="../imgs/acc-icon.png" alt="" id="profile-icon"></a>
  </nav>

  <main>
    <div id="title-container">
      <img src="../imgs/back.png" alt="" id="back-btn" onclick="window.location.href='/users/dash'">
      <h1 id="title"></h1><br>
      <p id="desc"></p>
    </div>
    
    <form id="form-container">
      <h2 id="section-1-title">Service</h2><br>
      <p class="section-title">A. Venue</p>
      <div class="section-input">
        <div>
          <input type="radio" id="venue-1" name="venue" value="1">
          <label for="venue-1">1</label>
        </div>
        <div>
          <input type="radio" id="venue-2" name="venue" value="2" class="radio-gap">
          <label for="venue-2">2</label>
        </div>
        <div>
          <input type="radio" id="venue-3" name="venue" value="3" class="radio-gap">
          <label for="venue-3">3</label>
        </div>
        <div>
          <input type="radio" id="venue-4" name="venue" value="4" class="radio-gap">
          <label for="venue-4">4</label>
        </div>
        <div>
          <input type="radio" id="venue-5" name="venue" value="5" class="radio-gap">
          <label for="venue-5">5</label>
        </div>
      </div>
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">B. Lighting and Sounds</p>
      <div class="section-input">
        <div>
          <input type="radio" id="ls-1" name="ls" value="1">
          <label for="ls-1">1</label>
        </div>
        <div>
          <input type="radio" id="ls-2" name="ls" value="2" class="radio-gap">
          <label for="ls-2">2</label>
        </div>
        <div>
          <input type="radio" id="ls-3" name="ls" value="3" class="radio-gap">
          <label for="ls-3">3</label>
        </div>
        <div>
          <input type="radio" id="ls-4" name="ls" value="4" class="radio-gap">
          <label for="ls-4">4</label>
        </div>
        <div>
          <input type="radio" id="ls-5" name="ls" value="5" class="radio-gap">
          <label for="ls-5">5</label>
        </div>
      </div>
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">C. Materials</p>
      <div class="section-input">
        <div>
          <input type="radio" id="materials-1" name="materials" value="1">
          <label for="materials-1">1</label>
        </div>
        <div>
          <input type="radio" id="materials-2" name="materials" value="2" class="radio-gap">
          <label for="materials-2">2</label>
        </div>
        <div>
          <input type="radio" id="materials-3" name="materials" value="3" class="radio-gap">
          <label for="materials-3">3</label>
        </div>
        <div>
          <input type="radio" id="materials-4" name="materials" value="4" class="radio-gap">
          <label for="materials-4">4</label>
        </div>
        <div>
          <input type="radio" id="materials-5" name="materials" value="5" class="radio-gap">
          <label for="materials-5">5</label>
        </div>
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">D. Accomodation</p>
      <div class="section-input">
        <div>
          <input type="radio" id="accomodation-1" name="accomodation" value="1">
          <label for="accomodation-1">1</label>
        </div>
        <div>
          <input type="radio" id="accomodation-2" name="accomodation" value="2" class="radio-gap">
          <label for="accomodation-2">2</label>
        </div>
        <div>
          <input type="radio" id="accomodation-3" name="accomodation" value="3" class="radio-gap">
          <label for="accomodation-3">3</label>
        </div>
        <div>
          <input type="radio" id="accomodation-4" name="accomodation" value="4" class="radio-gap">
          <label for="accomodation-4">4</label>
        </div>
        <div>
          <input type="radio" id="accomodation-5" name="accomodation" value="5" class="radio-gap">
          <label for="accomodation-5">5</label>
        </div>
      </div>
      <div style="margin: 1.5rem 0;"></div>

      <br><h2 id="section-2-title">Activity Design</h2><br>
      <p class="section-title">A. Meet Activity Goals/Objectives</p>
      <div class="section-input">
        <div>
          <input type="radio" id="goals-1" name="goals" value="1">
          <label for="goals-1">1</label>
        </div>
        <div>
          <input type="radio" id="goals-2" name="goals" value="2" class="radio-gap">
          <label for="goals-2">2</label>
        </div>
        <div>
          <input type="radio" id="goals-3" name="goals" value="3" class="radio-gap">
          <label for="goals-3">3</label>
        </div>
        <div>
          <input type="radio" id="goals-4" name="goals" value="4" class="radio-gap">
          <label for="goals-4">4</label>
        </div>
        <div>
          <input type="radio" id="goals-5" name="goals" value="5" class="radio-gap">
          <label for="goals-5">5</label>
        </div>
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">B. Methods/Strategies Used</p>
      <div class="section-input">
        <div>
          <input type="radio" id="methods-1" name="methods" value="1">
          <label for="methods-1">1</label>
        </div>
        <div>
          <input type="radio" id="methods-2" name="methods" value="2" class="radio-gap">
          <label for="methods-2">2</label>
        </div>
        <div>
          <input type="radio" id="methods-3" name="methods" value="3" class="radio-gap">
          <label for="methods-3">3</label>
        </div>
        <div>
          <input type="radio" id="methods-4" name="methods" value="4" class="radio-gap">
          <label for="methods-4">4</label>
        </div>
        <div>
          <input type="radio" id="methods-5" name="methods" value="5" class="radio-gap">
          <label for="methods-5">5</label>
        </div>
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">C. Sequence of Topic</p>
      <div class="section-input">
        <div>
          <input type="radio" id="sequence-1" name="sequence" value="1">
          <label for="sequence-1">1</label>
        </div>
        <div>
          <input type="radio" id="sequence-2" name="sequence" value="2" class="radio-gap">
          <label for="sequence-2">2</label>
        </div>
        <div>
          <input type="radio" id="sequence-3" name="sequence" value="3" class="radio-gap">
          <label for="sequence-3">3</label>
        </div>
        <div>
          <input type="radio" id="sequence-4" name="sequence" value="4" class="radio-gap">
          <label for="sequence-4">4</label>
        </div>
        <div>
          <input type="radio" id="sequence-5" name="sequence" value="5" class="radio-gap">
          <label for="sequence-5">5</label>
        </div>
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">D. Schedule/Duration of Activity</p>
      <div class="section-input">
        <div>
          <input type="radio" id="duration-1" name="duration" value="1">
          <label for="duration-1">1</label>
        </div>
        <div>
          <input type="radio" id="duration-2" name="duration" value="2" class="radio-gap">
          <label for="duration-2">2</label>
        </div>
        <div>
          <input type="radio" id="duration-3" name="duration" value="3" class="radio-gap">
          <label for="duration-3">3</label>
        </div>
        <div>
          <input type="radio" id="duration-4" name="duration" value="4" class="radio-gap">
          <label for="duration-4">4</label>
        </div>
        <div>
          <input type="radio" id="duration-5" name="duration" value="5" class="radio-gap">
          <label for="duration-5">5</label>
        </div>
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <br><h2 id="section-3-title">Participation</h2><br>
      <p class="section-title">A. Participation in Activities</p>
      <div class="section-input">
        <div>
          <input type="radio" id="participation-1" name="participation" value="1">
          <label for="participation-1">1</label>
        </div>
        <div>
          <input type="radio" id="participation-2" name="participation" value="2" class="radio-gap">
          <label for="participation-2">2</label>
        </div>
        <div>
          <input type="radio" id="participation-3" name="participation" value="3" class="radio-gap">
          <label for="participation-3">3</label>
        </div>
        <div>
          <input type="radio" id="participation-4" name="participation" value="4" class="radio-gap">
          <label for="participation-4">4</label>
        </div>
        <div>
          <input type="radio" id="participation-5" name="participation" value="5" class="radio-gap">
          <label for="participation-5">5</label>
        </div>
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">B. Fulfillment of Assigned Tasks</p>
      <div class="section-input">
        <div>
          <input type="radio" id="fulfillment-1" name="fulfillment" value="1">
          <label for="fulfillment-1">1</label>
        </div>
        <div>
          <input type="radio" id="fulfillment-2" name="fulfillment" value="2" class="radio-gap">
          <label for="fulfillment-2">2</label>
        </div>
        <div>
          <input type="radio" id="fulfillment-3" name="fulfillment" value="3" class="radio-gap">
          <label for="fulfillment-3">3</label>
        </div>  
        <div>
          <input type="radio" id="fulfillment-4" name="fulfillment" value="4" class="radio-gap">
          <label for="fulfillment-4">4</label>
        </div>
        <div>
          <input type="radio" id="fulfillment-5" name="fulfillment" value="5" class="radio-gap">
          <label for="fulfillment-5">5</label>
        </div>
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">C. Following Rules and Instructions</p>
      <div class="section-input">
        <div>
          <input type="radio" id="rules-1" name="rules" value="1">
          <label for="rules-1">1</label>
        </div>
        <div>
          <input type="radio" id="rules-2" name="rules" value="2" class="radio-gap">
          <label for="rules-2">2</label>
        </div>
        <div>
          <input type="radio" id="rules-3" name="rules" value="3" class="radio-gap">
          <label for="rules-3">3</label>
        </div>
        <div>
          <input type="radio" id="rules-4" name="rules" value="4" class="radio-gap">
          <label for="rules-4">4</label>
        </div>
        <div>
          <input type="radio" id="rules-5" name="rules" value="5" class="radio-gap">
          <label for="rules-5">5</label>
        </div>
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">D. Participant Behavior and Decorum</p>
      <div class="section-input">
        <div>
          <input type="radio" id="behavior-1" name="behavior" value="1">
          <label for="behavior-1">1</label>
        </div>
        <div>
          <input type="radio" id="behavior-2" name="behavior" value="2" class="radio-gap">
          <label for="behavior-2">2</label>
        </div>
        <div>
          <input type="radio" id="behavior-3" name="behavior" value="3" class="radio-gap">
          <label for="behavior-3">3</label>
        </div>
        <div>
          <input type="radio" id="behavior-4" name="behavior" value="4" class="radio-gap">
          <label for="behavior-4">4</label>
        </div>
        <div>
          <input type="radio" id="behavior-5" name="behavior" value="5" class="radio-gap">
          <label for="behavior-5">5</label>
        </div>
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <br><h2 id="section-4-title">Facilitator</h2><br>
      <p class="section-title">A. Addressed Response to all Audience Members</p>
      <div class="section-input">
        <div>
          <input type="radio" id="response-1" name="response" value="1">
          <label for="response-1">1</label>
        </div>
        <div>
          <input type="radio" id="response-2" name="response" value="2" class="radio-gap">
          <label for="response-2">2</label>
        </div>
        <div>
          <input type="radio" id="response-3" name="response" value="3" class="radio-gap">
          <label for="response-3">3</label>
        </div>
        <div>
          <input type="radio" id="response-4" name="response" value="4" class="radio-gap">
          <label for="response-4">4</label>
        </div>
        <div>
          <input type="radio" id="response-5" name="response" value="5" class="radio-gap">
          <label for="response-5">5</label>
        </div>
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">B. Level of Preparation</p>
      <div class="section-input">
        <div>
          <input type="radio" id="level-1" name="level" value="1">
          <label for="level-1">1</label>
        </div>
        <div>
          <input type="radio" id="level-2" name="level" value="2" class="radio-gap">
          <label for="level-2">2</label>
        </div>
        <div>
          <input type="radio" id="level-3" name="level" value="3" class="radio-gap">
          <label for="level-3">3</label>
        </div>
        <div>
          <input type="radio" id="level-4" name="level" value="4" class="radio-gap">
          <label for="level-4">4</label>
        </div>
        <div>
          <input type="radio" id="level-5" name="level" value="5" class="radio-gap">
          <label for="level-5">5</label>
        </div>
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">C. Positive Personality</p>
      <div class="section-input">
        <div>
          <input type="radio" id="personality-1" name="personality" value="1">
          <label for="personality-1">1</label>
        </div>
        <div>
          <input type="radio" id="personality-2" name="personality" value="2" class="radio-gap">
          <label for="personality-2">2</label>
        </div>
        <div>
          <input type="radio" id="personality-3" name="personality" value="3" class="radio-gap">
          <label for="personality-3">3</label>
        </div>
        <div>
          <input type="radio" id="personality-4" name="personality" value="4" class="radio-gap">
          <label for="personality-4">4</label>
        </div> 
        <div>
          <input type="radio" id="personality-5" name="personality" value="5" class="radio-gap">
          <label for="personality-5">5</label>
        </div>
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">D. Maintained Participant's Interests</p>
      <div class="section-input">
        <div>
          <input type="radio" id="interest-1" name="interest" value="1">
          <label for="interest-1">1</label>
        </div>
        <div>
          <input type="radio" id="interest-2" name="interest" value="2" class="radio-gap">
          <label for="interest-2">2</label>
        </div>
        <div>
          <input type="radio" id="interest-3" name="interest" value="3" class="radio-gap">
          <label for="interest-3">3</label>
        </div>
        <div>
          <input type="radio" id="interest-4" name="interest" value="4" class="radio-gap">
          <label for="interest-4">4</label>
        </div>
        <div>
          <input type="radio" id="interest-5" name="interest" value="5" class="radio-gap">
          <label for="interest-5">5</label>
        </div>
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">E. Audience Control</p>
      <div class="section-input">
        <div>
          <input type="radio" id="audience-1" name="audience" value="1">
          <label for="audience-1">1</label>
        </div>
        <div>
          <input type="radio" id="audience-2" name="audience" value="2" class="radio-gap">
          <label for="audience-2">2</label>
        </div>
        <div>
          <input type="radio" id="audience-3" name="audience" value="3" class="radio-gap">
          <label for="audience-3">3</label>
        </div>
        <div>
          <input type="radio" id="audience-4" name="audience" value="4" class="radio-gap">
          <label for="audience-4">4</label>
        </div>
        <div>
          <input type="radio" id="audience-5" name="audience" value="5" class="radio-gap">
          <label for="audience-5">5</label>
        </div>
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <br><h2 id="section-5-title">Emcee</h2><br>
      <p class="section-title">A. Speech</p>
      <div class="section-input">
        <div>
          <input type="radio" id="speech-1" name="speech" value="1">
          <label for="speech-1">1</label>
        </div>
        <div>
          <input type="radio" id="speech-2" name="speech" value="2" class="radio-gap">
          <label for="speech-2">2</label>
        </div>
        <div>
          <input type="radio" id="speech-3" name="speech" value="3" class="radio-gap">
          <label for="speech-3">3</label>
        </div>
        <div>
           <input type="radio" id="speech-4" name="speech" value="4" class="radio-gap">
          <label for="speech-4">4</label>
        </div>
        <div>
          <input type="radio" id="speech-5" name="speech" value="5" class="radio-gap">
          <label for="speech-5">5</label>
        </div>
      </div>
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">B. Presence</p>
      <div class="section-input">
        <div>
          <input type="radio" id="presence-1" name="presence" value="1">
          <label for="presence-1">1</label>
        </div>
        <div>
          <input type="radio" id="presence-2" name="presence" value="2" class="radio-gap">
          <label for="presence-2">2</label>
        </div>
        <div>
          <input type="radio" id="presence-3" name="presence" value="3" class="radio-gap">
          <label for="presence-3">3</label>
        </div>
        <div>
          <input type="radio" id="presence-4" name="presence" value="4" class="radio-gap">
          <label for="presence-4">4</label>
        </div>
        <div>
          <input type="radio" id="presence-5" name="presence" value="5" class="radio-gap">
          <label for="presence-5">5</label>
        </div>
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">C. Interaction</p>
      <div class="section-input">
        <div>
          <input type="radio" id="interaction-1" name="interaction" value="1">
          <label for="interaction-1">1</label>
        </div>
        <div>
          <input type="radio" id="interaction-2" name="interaction" value="2" class="radio-gap">
          <label for="interaction-2">2</label>
        </div>
        <div>
          <input type="radio" id="interaction-3" name="interaction" value="3" class="radio-gap">
          <label for="interaction-3">3</label>
        </div>
        <div>
           <input type="radio" id="interaction-4" name="interaction" value="4" class="radio-gap">
          <label for="interaction-4">4</label>
        </div>
        <div>
          <input type="radio" id="interaction-5" name="interaction" value="5" class="radio-gap">
          <label for="interaction-5">5</label>
        </div>      
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">D. Clarity</p>
      <div class="section-input">
        <div>
          <input type="radio" id="clarity-1" name="clarity" value="1">
          <label for="clarity-1">1</label>
        </div>
        <div>
          <input type="radio" id="clarity-2" name="clarity" value="2" class="radio-gap">
          <label for="clarity-2">2</label>
        </div>
        <div>
          <input type="radio" id="clarity-3" name="clarity" value="3" class="radio-gap">
          <label for="clarity-3">3</label>
        </div>
        <div>
           <input type="radio" id="clarity-4" name="clarity" value="4" class="radio-gap">
          <label for="clarity-4">4</label>
        </div>
        <div>
          <input type="radio" id="clarity-5" name="clarity" value="5" class="radio-gap">
          <label for="clarity-5">5</label>
        </div>
      </div>    
      <div style="margin: 1.5rem 0;"></div>

      <p class="section-title">E. Preparedness</p>
      <div class="section-input">
        <div>
          <input type="radio" id="preparedness-1" name="preparedness" value="1">
          <label for="preparedness-1">1</label>
        </div>
        <div>
          <input type="radio" id="preparedness-2" name="preparedness" value="2" class="radio-gap">
          <label for="preparedness-2">2</label>
        </div>
        <div>
          <input type="radio" id="preparedness-3" name="preparedness" value="3" class="radio-gap">
          <label for="preparedness-3">3</label>
        </div>
        <div>
          <input type="radio" id="preparedness-4" name="preparedness" value="4" class="radio-gap">
          <label for="preparedness-4">4</label>
        </div>
        <div>
          <input type="radio" id="preparedness-5" name="preparedness" value="5" class="radio-gap">
          <label for="preparedness-5">5</label>
        </div>
      </div>    
      <div style="margin: 3rem 0;"></div>

      <label for="feedback" class="section-title">Feedback:</label>
      <div style="margin: 0.5rem 0;"></div>
      <textarea id="feedback" name="feedback"></textarea>
      <div style="margin: 1.5rem 0;"></div>

      <div>
        <label class="section-title" id="event-rate-label">Rate the event:</label>
        <div style="margin: 0.5rem 0;"></div>
        <div class="section-rate">
          <div>
            <input type="radio" id="positive" name="event-rate" value="Positive">
            <label for="positive">Positive</label>
          </div>
          <div>
            <input type="radio" id="negative" name="event-rate" value="Negative">
            <label for="negative">Negative</label>
          </div>
        </div>
      </div>
      <div style="margin: 3rem 0;"></div>
    </form>
  </main>
</body>
</html>