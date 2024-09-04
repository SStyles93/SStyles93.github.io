---
title: OpenGL Scene - Detailed Implementation
categories: [Graphic, OpenGL]
image: /assets/images/opengl/lastScene.PNG
---

Overview and explanation of my hand made graphic engine coded in C++ and OpenGL.
The engine includes features such as deferred rendering, Physically based rendering (PBR), image based lighting (IBL) and much more...

## Contextualisation

During my second year of bachelor's degree in Game Programming, the last module I studied was about
graphics programming. 


For that module, I was introduced to [OpenGL](https://www.opengl.org/) and followed some steps of the [LearnOpenGL](https://learnopengl.com/) web site. After that I had to put all my knowledge together to render a complete scene as showed below.

![]({{ site.baseurl }}/assets/images/opengl/lastScene.PNG "LastScene"){: width="100%"}

To do so, I went through a lot of testing and created a lot of different scenes. All of them can be found [here](https://github.com/SStyles93/opengl-scene).  
Note that this is not (at all) an example of clean code, with abstractions, optimisations and good C++ practices. It was done with a limited amount of time and had to be ended well before all the features I would of liked where implemented.

## Overview

Since this is a graphical topic, The best way to get into the scene is probably to do a graph that resumes the flow.

![]({{ site.baseurl }}/assets/images/opengl/SceneFlow.PNG "SceneFlow"){: width="100%"}

As shown above, the scene initialises all the data needed in the `Begin()`, updates all the values in the `Update()` and finished by destroying all buffers in the `End()`.

One thing to take in consideration is that there is an `engine` class running all the code for the `scene` and taking care of everything related to the window, the events and UI in the same order with `Begin()`, `Run()` and `End()` but that part will not be discussed in this post and can be found in the project repository.


## Initialisation

For the `Begin()` (initialisation), I started by setting the global OpenGL parameters.  

The parameters to set where:  
- `glEnable(GL_DEPTH_TEST);` to enable depth testing.
- `glEnable(GL_CULL_FACE);` that enabled [FaceCulling](https://en.wikipedia.org/wiki/Back-face_culling) 
- `glCullFace(GL_BACK);` that would cull the back faces 
- `glFrontFace(GL_CCW);` that would define how (in vertex order) a front face is defined.  
To add [IBL](https://en.wikipedia.org/wiki/Image-based_lighting) to my project I also needed `glDepthFunc(GL_LEQUAL);` and `glEnable(GL_TEXTURE_CUBE_MAP_SEAMLESS);`.  
  
After setting the global parameters, I used three abstractions to load different elements:  
- `Model` to keep textures, meshes, VBOs and the directories of the different models.
- `Material` to keep textures for objects that weren't loaded such as planes, cubes or spheres.
- `Pipeline` to store the vertex shaders and fragment shaders in a "Program", set and use it when necessary.  

With loading done, I had to deal with the position, rotation and scale of each object. Since I was using 
[instancing](https://en.wikipedia.org/wiki/Geometry_instancing), I created an abstraction `ModelMatrices` that stored the model matrix and the normal matrix of each object and had a simple method `SetObject()` that would simplify their modification in space:  
```c++
void ModelMatrices::SetObject(glm::vec3 position, glm::vec3 rotationAxis,float angle, glm::vec3 scale)
	{
		glm::mat4 model = glm::mat4(1.0f);
		model = glm::translate(model, position);
		model = glm::rotate(model, glm::radians(angle), glm::normalize(rotationAxis));
		model = glm::scale(model, scale);
		this->model = model;
		this->normal = glm::transpose(glm::inverse(model));
	}
```

Afterwards I had to generate and set all the framebuffers used along by pipeline. The first I set was the ShadowMap buffer, basically a depthbuffer from the "camera" point of view of the directionnal light.  

![]({{ site.baseurl }}/assets/images/opengl/ShadowMap.PNG "ShadowMap"){: width="100%"}

Then the "gBuffer" used to apply [DeferredRendering](https://learnopengl.com/Advanced-Lighting/Deferred-Shading); its implementation required to change the way the pipeline was functioning at the beginning. Where in forward rendering we used to have two shaders (vertex & fragment) the deferred rendering required a buffer (gBuffer) and four shaders.  
Here the setting of the FrameBuffer:  
```c++
glGenFramebuffers(1, &gBuffer);
glBindFramebuffer(GL_FRAMEBUFFER, gBuffer);
// position color buffer
glGenTextures(1, &gPosition);
glBindTexture(GL_TEXTURE_2D, gPosition);
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA16F, SCREEN_WIDTH, SCREEN_HEIGHT, 0, GL_RGBA, GL_FLOAT, NULL);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, gPosition, 0);
// color buffer
glGenTextures(1, &gBaseColor);
glBindTexture(GL_TEXTURE_2D, gBaseColor);
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA16F, SCREEN_WIDTH, SCREEN_HEIGHT, 0, GL_RGBA, GL_FLOAT, NULL);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT1, GL_TEXTURE_2D, gBaseColor, 0);
// normal color buffer
glGenTextures(1, &gNormal);
glBindTexture(GL_TEXTURE_2D, gNormal);
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA16F, SCREEN_WIDTH, SCREEN_HEIGHT, 0, GL_RGBA, GL_FLOAT, NULL);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT2, GL_TEXTURE_2D, gNormal, 0);
//ARM
glGenTextures(1, &gARM);
glBindTexture(GL_TEXTURE_2D, gARM);
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA16F, SCREEN_WIDTH, SCREEN_HEIGHT, 0, GL_RGBA, GL_FLOAT, NULL);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT3, GL_TEXTURE_2D, gARM, 0);
//SSAO
glGenTextures(1, &gSSAO);
glBindTexture(GL_TEXTURE_2D, gSSAO);
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA16F, SCREEN_WIDTH, SCREEN_HEIGHT, 0, GL_RGBA, GL_FLOAT, NULL);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT4, GL_TEXTURE_2D, gSSAO, 0);

// tell OpenGL which color attachments we'll use (of this framebuffer) for rendering 
unsigned int attachments[5] = {
	GL_COLOR_ATTACHMENT0, GL_COLOR_ATTACHMENT1, GL_COLOR_ATTACHMENT2,
	GL_COLOR_ATTACHMENT3, GL_COLOR_ATTACHMENT4 , /*GL_COLOR_ATTACHMENT5, GL_COLOR_ATTACHMENT6 */ };

glDrawBuffers(5, attachments);
// create and attach depth buffer (renderbuffer)
glGenRenderbuffers(1, &rboDepth);
glBindRenderbuffer(GL_RENDERBUFFER, rboDepth);
glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT, SCREEN_WIDTH, SCREEN_HEIGHT);
glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, rboDepth);

// finally check if framebuffer is complete
if (glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE)
	std::cout << "Framebuffer not complete!" << std::endl;
glBindFramebuffer(GL_FRAMEBUFFER, 0);

```
As you see there are multiple attachments to this framebuffer used to store the data from the geometry pass (Position, BaseColor, Normal, ARM, SSAO) and then send them in `uniform` as `Sampler2D` (textures) to the lighting pass. 

The last framebuffers I had to set where the [SSAO](https://learnopengl.com/Advanced-Lighting/SSAO) & SSAO_Blur, IBL, Bloom & Blur buffers. For these I am not going to go in detail.

## Update

After the initialisation done, the `Update()` is called by the `engine`. First it calls the Shadow pass, setting a static frustrum for the directional light. Unfortunately I didn't have enough time to set a dynamic one.

Then the Geometry pass is called and that is where thing become interesting. During the geometry pass I bind the gBuffer with `glBindFramebuffer(GL_FRAMEBUFFER, gBuffer);` and then draw the elements with this method:  
```c++
void Model::DrawInstances(Pipeline& pipeline, std::span<ModelMatrices> modelMatrices, const int count,
	                          const glm::mat4 projection, const glm::mat4 view)
{
	pipeline.use();
	pipeline.setMat4("projection", projection);
	pipeline.setMat4("view", view);

	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferSubData(GL_ARRAY_BUFFER, 0, static_cast<GLsizeiptr>(modelMatrices.size_bytes()), modelMatrices.data());

	for (auto& mesh : meshes)
	{
		mesh.BindMaterial(pipeline);
		glBindVertexArray(mesh.VAO);
		glDrawElementsInstanced(
			GL_TRIANGLES,
			static_cast<GLsizei>(mesh.indices.size()),
			GL_UNSIGNED_INT, nullptr, count);
		glBindVertexArray(0);
	}
}
```
The elements are either drawn with a pipeline using ARM as separate textures with one fragment shader:  
```c++

//...
//Shader parameters

void main()
{    
    ///World Pos
    gPosition = WorldPos;
    //Base color
    gBaseColor.rgb = texture(texture_diffuse1, TexCoords).rgb;

    //Normal
    vec3 tangentNormal = texture(texture_normal1, TexCoords).rgb * 2.0 - 1.0;
    vec3 Q1  = dFdx(WorldPos);
    vec3 Q2  = dFdy(WorldPos);
    
    vec2 st1 = dFdx(TexCoords);
    vec2 st2 = dFdy(TexCoords);

    vec3 N = normalize(Normal);
    vec3 T = normalize(Q1*st2.t - Q2*st1.t);
    vec3 B = -normalize(cross(N, T));
    mat3 TBN = mat3(T, B, N);
    gNormal.rgb = TBN * tangentNormal;

    // Ambient Roughness Metallic
    gARM.r = texture(texture_ao1, TexCoords).r;
    gARM.g = texture(texture_roughness1, TexCoords).r;
    gARM.b = texture(texture_metallic1, TexCoords).r;

    //SSAO ViewPos
    gSSAO = FragPos;
}

```

![]({{ site.baseurl }}/assets/images/opengl/separateARM.PNG "separateARM"){: width="25%"}

or combining them together as one texture with an other fragment shader:  

```c++

//...
//Shader parameters

void main()
{    
    ///World Pos
    gPosition = WorldPos;
    //Base color
    gBaseColor.rgb = texture(texture_diffuse1, TexCoords).rgb;

    //Normal
    vec3 tangentNormal = texture(texture_normal1, TexCoords).rgb * 2.0 - 1.0;
    vec3 Q1  = dFdx(WorldPos);
    vec3 Q2  = dFdy(WorldPos);
    
    vec2 st1 = dFdx(TexCoords);
    vec2 st2 = dFdy(TexCoords);

    vec3 N = normalize(Normal);
    vec3 T = normalize(Q1*st2.t - Q2*st1.t);
    vec3 B = -normalize(cross(N, T));
    mat3 TBN = mat3(T, B, N);
    gNormal.rgb = TBN * tangentNormal;

    // Ambient Roughness Metallic
    gARM.rgb = texture(texture_arm1, TexCoords).rgb;

    //SSAO ViewPos
    gSSAO = FragPos;
}

```

![]({{ site.baseurl }}/assets/images/opengl/combinedARM.PNG "combinedARM"){: width="25%"}

After the geometry pass has written in the buffer, the SSAO pass is called taking in as textures: positions, normals and a noise texture. The image is then rendered to the buffer and blurred with the SSAOBlur shader:  

SSAO | SSAO Blur
:-----:|:-----:
![]({{ site.baseurl }}/assets/images/opengl/SSAO.PNG "SSAO"){: width="100%"} | ![]({{ site.baseurl }}/assets/images/opengl/SSAO1.PNG "SSAO1"){: width="100%"} 

Then the Light pass is called and calculates all the lighting for every object but only once!  

Setting of the light pass pipeline:
```c++
//...
//Pipeline use & set

glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
glActiveTexture(GL_TEXTURE0);
glBindTexture(GL_TEXTURE_2D, gPosition);
glActiveTexture(GL_TEXTURE1);
glBindTexture(GL_TEXTURE_2D, gBaseColor);
glActiveTexture(GL_TEXTURE2);
glBindTexture(GL_TEXTURE_2D, gNormal);
glActiveTexture(GL_TEXTURE3);
glBindTexture(GL_TEXTURE_2D, gARM);

//SSAO
glActiveTexture(GL_TEXTURE4);
glBindTexture(GL_TEXTURE_2D, ssaoColorBufferBlur);

// bind pre-computed IBL data
glActiveTexture(GL_TEXTURE5);
glBindTexture(GL_TEXTURE_CUBE_MAP, irradianceMap);
glActiveTexture(GL_TEXTURE6);
glBindTexture(GL_TEXTURE_CUBE_MAP, prefilterMap);
glActiveTexture(GL_TEXTURE7);
glBindTexture(GL_TEXTURE_2D, brdfLUTTexture);

//Shadow
glActiveTexture(GL_TEXTURE8);
glBindTexture(GL_TEXTURE_2D, depthMap);

//light info sent...
//...

```
Finally it renders the result in a texture that is copied in a hdr buffer with:  
```c++
glBindFramebuffer(GL_READ_FRAMEBUFFER, gBuffer);
		glBindFramebuffer(GL_DRAW_FRAMEBUFFER, hdrBuffer); // write to hdr framebuffer
		glBlitFramebuffer(0, 0,
			SCREEN_WIDTH, SCREEN_HEIGHT,
			0, 0,
			SCREEN_WIDTH, SCREEN_HEIGHT,
			GL_DEPTH_BUFFER_BIT, GL_NEAREST);

		glBindFramebuffer(GL_FRAMEBUFFER, hdrBuffer);
```
After that being done, the rendering of boxes to show light positions is done, the environment cubemap is drawn and a final pass of bloom and blur is done using down and upsampling.

Downsample | Upsample
:-----:|:-----:
![]({{ site.baseurl }}/assets/images/opengl/downsampling.PNG "downsample"){: width="100%"} | ![]({{ site.baseurl }}/assets/images/opengl/upsampling.PNG "upsample"){: width="75%"}

The last feature I implemented in the scene, that was called by the engine's `Run`, was some GUIs with [ImGui](https://github.com/ocornut/imgui). The idea was to give the possibility to the user to play a bit with some elements is my scene.

## The End

In the `End()` of the program, I clear all the buffers as shown below:  
```c++
	void RenderScene::End()
{
	glDeleteBuffers(1, &gBuffer);

	glDeleteVertexArrays(1, &cubeVAO);
	glDeleteBuffers(1, &cubeVBO);
	glDeleteVertexArrays(1, &quadVAO);
	glDeleteBuffers(1, &quadVBO);

	glDeleteBuffers(1, &hdrBuffer);
	glDeleteBuffers(1, &hdrRBO);
	glDeleteBuffers(1, &colorBuffers[0]);
	glDeleteBuffers(1, &colorBuffers[1]);
	glDeleteBuffers(1, &pingpongFBO[0]);
	glDeleteBuffers(1, &pingpongFBO[1]);
	glDeleteBuffers(1, &pingpongColorbuffers[0]);
	glDeleteBuffers(1, &pingpongColorbuffers[1]);

	glDeleteBuffers(1, &ssaoFBO);
	glDeleteBuffers(1, &ssaoBlurFBO);
	glDeleteBuffers(1, &ssaoColorBuffer);
	glDeleteBuffers(1, &ssaoColorBufferBlur);

	glDeleteVertexArrays(1, &planeVAO);
	glDeleteBuffers(1, &planeVAO);

	bloomRenderer.Destroy();
}
```

## Conclusion

I think overall that learning OpenGL was really a fun experience. Sometimes it was really frustrating and long to debug but if I had more time I would of loved to do much more: clean up the project, do some abstractions for better usability, implement [gltf](https://en.wikipedia.org/wiki/GlTF) and make it work, use [KTX](https://github.com/KhronosGroup/KTX-Specification) to optimise the loading of my textures, implement Cascaded Shadow Maps [CSM](https://learnopengl.com/Guest-Articles/2021/CSM), add a job system to multithread loading and render a more furnished and better looking scene.  

That being said I am still very proud of what I was able to create during this journey discovering OpenGL.

![]({{ site.baseurl }}/assets/images/opengl/scene1.PNG "LastScene"){: width="100%"}

The entire project can be found [here](https://github.com/SStyles93/opengl-scene).
