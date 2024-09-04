---
title: Post-Mortem Projects GK & VR - Specialization Projects
categories: [Graphic, Producing]
image: assets/images/projectproducing/PP_Intro.gif
---

# Post-Mortem Project GK
## Context
During the 3rd year of studies at SAE Institute, the Game Programming, Game Art and Audio Engineering students have to make a game together. This year was a bit special, since we made two games instead of one. One of them is a puzzle adventure game where you play a girl and a cat solving puzzles in dreamlike worlds (Project Girl and Kitty). The other one is a VR game inspired by escape rooms where you have to solve puzzles to get out of a room with a dead body (Project VR). This document is only about both projects and the process.
The pre-production went from June 2023 to September 2023. The production of a vertical slice of the games lasted until February the 9th. The goal was not to have two finished game, but to demonstrate a part of it with the final quality.
### Constraint
For the project GK the constraint, imposed by our teacher, Elias Farhan, was to use Unreal Engine 5.
The pitch for the Girl and Kitty project was the following:  “Explore the dream worlds of a sick child in the company of a cat with magical powers in Project Girl and Kitty, a contemplative 3D puzzle-adventure game. Manipulate objects by making them change size using the cat's powers to solve unique puzzles, and immerse yourself in a captivating adventure combining imagination and challenges.”

For the project VR, we had the following constraints:

- Using Unreal Engine 5
- Making a VR game
- Start the project with the provided pitch

The pitch was :

#quote()[
Project VR is a virtual reality puzzle game where the main character, in
the midst of a hangover, must reconstruct the events of the previous day
by solving puzzles in their closed apartment.
]

### Team
The team was split into three teams : Programming, Art and Audio. Each person also had a more specific role. For the artists, roles were assigned by the teacher, as for the programmers, tasks were undertaken according to skills.
The goal for the audio team was to be able to work on the game though a WWise session hosted on a perforce server. However, during the production, we weren’t able to set that up due to technical difficulties. Meaning that we couldn’t integrate the audio engineering section’s work before the end of the final deadline and that the integration could only be done before with a USB key.
Each department had the following members.

#### Stakeholders:
- Elias Farhan (Head Game Programming)
- Nicolas Vallée (Head Game Art)
- Stéphane Chapelle (Head Audio)
- Nicolas Brière (Project Guidance)
#### Programmers: 
- Samuel (Producer on GK & VR & Graphic programmer on GK)
- Dylan (Gameplayer Programmer on GK)
- Némoz (Gameplayer Programmer on GK and Game Designer on GK & VR)
- Benjamin (Programmer and Game Designer on VR)
- Edouard (Programmer on VR and Game Designer on GK & VR)
- Fabian (Product Owner on VR and SysAdmin on GK & VR)
#### Artists:
GK: 
- Johanna (Product Owner & Lead concept)
- Carla (Character & Asset modelling)
- José (Character, Asset, Environment modelling & integration)
- Elodie (Environment & Asset modelling)
- Matthias (Research & Development)
VR:
- Jessica (Lead Props / FX)
- Eliot (Lead UI)
- Jeremy (Lead R&D)
- Aliya (Lead Concepts / Character)
- Aurore (Lead Environnement / Animations / Integration)
#### Audio:
- Eliott (Lead audio & Music production)
- Théo (Lead audio & Music production/mixing with Wwise)
- Benjamin (audio production)
- Vincent (audio prod.)
- Tina (audio prod.)
- Gerogii (audio prod.)
- Jolan (audio prod.)
- Sebastian (audio prod.)
- Loris (audio prod.)
## Project
### Artistic Direction
The artistic direction was first suggested by the game art students that worked on the pitch elaboration of the game.
The first references where:
- Amelicart: an illustrator 
- Dordogne: a french watercolour game

![]({{ site.baseurl }}/assets/images/postmortemgk/Art_ref.PNG "Art references of Amelicart and Dordogne"){: width="100%"} _Art references of Amelicart and Dordogne_
  
- Tunic: a stylized isometric adventure game

![]({{ site.baseurl }}/assets/images/postmortemgk/Art_ref2.PNG "Tunic in game screenshots"){: width="100%"} _Tunic in game screenshots_

For the interface Carto and Dordogne where suggested.

![]({{ site.baseurl }}/assets/images/postmortemgk/Art_ref3.PNG "Art references of Amelicart and Dordogne"){: width="100%"} _Carto and Dordogne user interface examples_

The final decision was made by Nicolas Vallée, the head of the game art section.

For the VR project the graphic style, would be inspired by _Overwatch_,
_Paladin_, _Dauntless_ and _Agents of Mayhem_. As for
the palette and atmosphere, it is inspired by _Team Fortress 2_,
_Sky: Children of the Light_ and _Ratchet & Clank_ and
finally, for the environment, it is inspired by _NiBiRu: Age of
Secrets_ and _Black Mirror_.

![]({{ site.baseurl }}/assets/images/postmortemgk/VR_Concept.PNG "Art references of "){: width="100%"} _Vr Concept art_

### Production Tools
#### Project GK
The game was made on Unreal Engine 5. We mostly used C++ so we had to use Visual Studio 2022 as IDE. The project’s source was hosted on a Git repository located on a self-hosted GitLab instance. The assets were hosted on a Nextcloud instance. The hard-surface models were made using Maya or 3DS Max. As for the organic meshes, they were made on ZBrush.
The texturing process was eliminated for the artists since we used Unreal Engine 5’ s material system and decomposed meshes to texture the assets.

#### Project VR
The game was made on Unreal Engine 5. We mostly used blueprints, so we rarely had to use an IDE, but when we did, we used Visual Studio 2022.
The project's source was also hosted on the Git repository. The assets were on. The hard-surface models were made using Maya or 3DS Max. As for the organic meshes, they were made on ZBrush. As for the textures, the artists used Substance Painter.

### Organisation
At the beginning of the projects, we received a production lesson from William Marié, a Producer at Old Skull Games. This is what guided us for the biggest part of our organisation.
There were two management roles in the group : Myself as Producer, Fabian and Johanna as Product Owners. As a Producer, my role was to keep a good group dynamic and organise the different milestones and presentations. As for Fabian and Johanna, their responsibility was to define what tasks (user stories) were to be done by the team for the following sprint. A sprint is a 2 week period where the team tries to do a set amount of work. Each task has an intensity attached to it. It is similar to the time it takes to do, but it is not exactly the same. This intensity is supposed to serve as a guide on if there was too much or too little work during the sprint. However, this metric was not very useful on this project, since the amount of time everyone could put on the project varied frequently and it was hard to estimate the duration of tasks that we never did before.
At the end of each sprint, we did a Sprint Review / Sprint Planning / Sprint Retrospective (yes, all at the same time !). This is taken from the SCRUM method. The goal was for people to be able to tell their frustrations with the production and to improve things as they were advancing. We had to merge the three meetings into one, since there were very few moments where we could bring everyone together in the same room.
In parallel to the sprint reviews, we did weekly meetings on Fridays with Elias Farhan where we presented the work we did during the week. The goal of this meeting was mostly for Elias to see who did what and to raise red flags if he saw any. We could also ask him questions and get guidance.

## My role as a Producer
The role of a producer was one of the responsibilities assigned to me during this project. Thanks to Nicolas Brière, our head of department, Elias Farhan was able to arrange a master class with William Marié, a senior producer who had worked with OldSkullGames. Thanks to his guidance, the role that I took on without prior knowledge became more manageable.
The role itself comprised several tasks, including organising milestone objectives, reviewing sprint objectives with the product owners (PO), preparing and presenting the specific work and overall progress accomplished each week to the stakeholders, ensuring productivity, and resolving potential issues, whether they were human or technically related.
These tasks, relatively low in number, took a considerable amount of time and patience.
### Problems Encountered
During the process I encountered multiple problems related to people.
First of all, there were issues with assuming everyone understood things, leading to confusion. Another problem was not being clear about why we had organised a hierarchy and tasks in a certain way, causing some mix-ups and trouble in the teams. Dealing with conflicts between different departments and within our own teams was tough. Managing workloads was challenging, especially when people had other important responsibilities to handle first. Making decisions during critical moments was part of the job, but it sometimes disappointed, created tensions among team members and hurt feelings. Feeling like I didn't have enough power due to the hierarchy made me question my role and whether I was taken seriously.
The last problem regarding human interaction was the difficulty to manage time, objectives and tasks with non-responsive people. The lack of communication from them resulted in greater delays, work that was unfinished  or hadn’t even been started despite the fact that it had been planned. We also suffered from a wave of coronavirus that really didn’t help and reduced productivity too.
Regarding the work, we faced an enormous workload, which was physically and mentally challenging. There were conflicts between production and academic planning, causing production problems and a general reduction of performance for all the departments. The production plans changed during the process, requiring quick adjustments. Additionally, we had a lack of knowledge and practice making some tasks difficult either for myself as a producer or for others in their own roles and endeavours.
Being open about these problems was important. It helped us work together to find solutions and improve the project. We discussed these issues openly and tried our best to fix them.
Regarding the production itself, we had issues concerning the infrastructure and available material. The main problem was a consequence of a virus introduced in the work environment that resulted in a complete shutdown of the internet from the provider and the impossibility to set up servers and exchange work between us, thus rendering the communication, work and productivity extremely more intricate.

### What I Learned
Through my experiences as a producer, I've learned valuable lessons that I believe are crucial for future projects. Firstly, I learned not to underestimate the importance of ensuring that everyone truly understands the information. Assuming universal understanding can lead to confusion, so it's essential to take the time to ensure clarity.
Clear communication emerged as a powerful tool in project management. I discovered that being crystal clear about why tasks are organised in a certain way can prevent misunderstandings and improve teamwork. It definitely is a lesson on the impact of effective communication on a project’s success.
Another important realisation is that the role of a producer is a full-time commitment. The time and dedication required for this role should not be underestimated or neglected. The responsibilities, from managing conflicts to making critical decisions, demand consistent attention and effort.
Furthermore, I learned that effective communication, while crucial, can be time-consuming, sometimes surpassing initial expectations. Acknowledging and planning for the time investment in communication is vital for realistic project management. These insights have equipped me with a more nuanced understanding of the producer's role and the key factors that contribute to successful project outcomes.

## My Role as a Graphics Programmer
One of the roles I undertook during this project was  graphics programmer. Given that we used Unreal Engine 5, my primary responsibility involved creating materials using Unreal's nodal system. However, on rare occasions, I also had to develop specific shaders coded in HLSL.
The project that demanded the most effort in terms of materials and shaders was "Girl and Kitty." In our pursuit of reproducing a watercolour style, we decided to eliminate the traditional texturing done by artists from the pipeline. Instead, we kept separate meshes for the assets and performed colorization within Unreal Engine. This decision aimed not only to maintain coherence among the artists' work but also to accelerate the asset creation process.
Another aspect of my work involved crafting interactive shaders responsive to different parameters, along with various shaders related to the environment, such as a landscape and virtual texturing shader. 
Due to these reasons, my tasks as a graphic programmer were numerous and time-consuming.
### Problems Encountered
As a graphic programmer, I faced several challenges throughout the process. First and foremost was the difficulty in reproducing the watercolour style. Our reference, "Dordogne," was a hand-textured watercolour game, where the entire environment and assets were created on paper and scanned afterward. Replicating this style required extensive research and iterations to identify the optimal solution. Ultimately, a colorization pipeline was established, incorporating numerous shaders, material functions, and post-processing techniques.
Secondly, the substantial amount of work required to create shaders, going from artistic styles to interactive ones and making them user-friendly, ended up being extremely time-consuming.
### What I Learned
Throughout this process, I had the occasion of learning and mastering crucial facets of Unreal Engine 5, refining my skills in game development.
Discovering and learning in depth the Unreal Shader Pipeline, I developed expertise in optimising the unreal rendering processes, unravelling the intricacies of shader development. The node-based material system became my primary tool, where I mastered the art of material creation, utilising master nodes and material instances to reproduce a specific art style. I also discovered the post-processing tools that became very useful for refining visual quality and landscape and foliage tools that gave me the possibility to sculpt expansive and detailed outdoor environments. The adoption of virtual texturing transformed my approach to handling textures, allowing for the creation of virtual terrains without compromising performance. Linking C++ classes to shaders added a layer of interactivity to my creations, bringing them to life with responsive elements. 
Overall the knowledge acquired during this project was priceless, especially given that Unreal Engine is a vastly used engine in the game development industry. 
## Conclusion
These projects were overall really interesting. Even though the technical problems piled up, making the process really hard, the end result is acceptable given circumstances. I think we can still say that we all did our best despite the difficulties.
