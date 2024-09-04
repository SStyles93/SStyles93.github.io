---
title: OpenGL - From a Triangle to a PBR Scene
---

[Contextualisation](#contextualisation) - [The first Triangle](#the-first-Triangle) - 
[Cubes and Lighting](#cubes-and-lighting) - [Models](#models) - 
[The Z Axis](#the-z-axis) - [Instancing](#instancing) - [Shadows](#shadows) - 
[Deferred Rendering](#deferred-rendering) - [PBR in Deferred Rendering](#pbr-in-deferred-rendering) - 
[SSAO](#ssao) - [IBL, Bloom and final touches](#ibl-bloom-and-final-touches) - [Conclusion](#conclusion)

In the context of an exam at the SAE Institute Geneva, 
we were given the task of creating a scene in OpenGL and implement as many visual features as possible.

## Contextualisation

During my second year of bachelor's degree in Game Programming, the last module I studied was about
graphics programming. 


For that module, I was introduced to [OpenGL](https://www.opengl.org/) and followed some steps of the [LearnOpenGL](https://learnopengl.com/) web site. After that I had to put all my knowledge together in order to render a complete scene as showed below.

![]({{ site.baseurl }}/images/opengl/scene1.PNG "Scene"){: width="100%"}

## The first Triangle

At the beginning of the project, I was introduced to the basic concepts of graphical programming, I had to implement the C++ code and [shaders](https://en.wikipedia.org/wiki/Shader) to render a simple triangle on my screen.

![]({{ site.baseurl }}/images/opengl/triangle.PNG "Triangle"){: width="100%"}

To do so I used [GLEW](https://glew.sourceforge.net/), [GLM](https://github.com/g-truc/glm) for mathematics, and [SDL2](https://www.libsdl.org/) for windows and events in my engine.  

Past the basic installation and setup, I was introduced to the concept of Vertex Array Objects ["VAO"](https://www.khronos.org/opengl/wiki/Vertex_Specification#Vertex_Array_Object), basically a container for [vertices](https://en.wikipedia.org/wiki/Vertex_(geometry)#:~:text=In%20geometry%2C%20a%20vertex%20(in,polygons%20and%20polyhedra%20are%20vertices.#Definition)), and [pipelines](https://en.wikipedia.org/wiki/Graphics_pipeline) that are procedures going from the C++ code to the [vertex](https://www.khronos.org/opengl/wiki/Vertex_Shader) and [fragment](https://www.khronos.org/opengl/wiki/Fragment_Shader) shaders (at least), then the [rasterizer](https://en.wikipedia.org/wiki/Rasterisation) and finishes by being rendered on the screen. My first pipeline wasn't very impressive but nevertheless one must start somewhere before moving on to more complicated subjects.

## Cubes and Lighting

Once the challenge of understanding and being able to draw my first triangle on the screen was past, I had to understand further concepts such as Vertex Buffer Objects ["VBO"](https://www.khronos.org/opengl/wiki/Vertex_Specification#Vertex_Buffer_Object), Element Buffer Objects ["EBO"](https://www.khronos.org/opengl/wiki/Buffer_Object), [Textures](https://fr.wikipedia.org/wiki/Texture_(traitement_des_images)) and loading of these with [stb](https://github.com/nothings/stb), different type of [lights](https://en.wikipedia.org/wiki/Shading#Light_sources), [Phong](https://en.wikipedia.org/wiki/Phong_reflection_model#Description) reflection model and [Blinn-Phong](https://en.wikipedia.org/wiki/Blinn%E2%80%93Phong_reflection_model#Description) reflection model.  

With all these concepts accumulated in one project, the result was the following:  

![]({{ site.baseurl }}/images/opengl/cube.PNG "Cube"){: width="100%"}

## Models

Drawing cubes and lights was already a good first step into the computer graphics world. The next and obvious step to take was to implement model loading in a scene and then in my project. To do so I used [ASSIMP](https://github.com/assimp/assimp), an asset importer library.

![]({{ site.baseurl }}/images/opengl/backpack.PNG "backpack"){: width="100%"}

As you can see, where cubes where relatively easy to draw with their 36 triangles composing 6 faces. Loading a model composed of a lot of meshes sometimes can be quite frustrating.

## The Z Axis !

With all that done, I started to discover the beauty of what was possible using the Z axis  
(-Z as forward in my case).

I implemented, with different scenes, the concepts of [DepthBuffers](https://en.wikipedia.org/wiki/Z-buffering) and [StencilBuffers](https://en.wikipedia.org/wiki/Stencil_buffer).

![]({{ site.baseurl }}/images/opengl/stencil.PNG "stencil"){: width="100%"}

I also tried [blending](https://learnopengl.com/Advanced-OpenGL/Blending) that gave me the possibility to blend between transparent and coloured objects.  

![]({{ site.baseurl }}/images/opengl/blend.PNG "blend"){: width="100%"}

One other trick was to use `glEnable(GL_CULL_FACE);` that enabled [FaceCulling](https://en.wikipedia.org/wiki/Back-face_culling) with `glCullFace(GL_BACK);` that would cull the back faces and `glFrontFace(GL_CCW);` that would define how (in vertex order) a front face is defined. In this case `GL_CCW` stands for Counter Clock-Wise as opposite to `GL_CW` Clock-Wise.

With the use of the DepthBuffer I was also able to add a [SkyBox](https://en.wikipedia.org/wiki/Skybox_(video_games)) to my scene. Of course the principle of [CubeMapping](https://en.wikipedia.org/wiki/Cube_mapping) was necessary to render it.

![]({{ site.baseurl }}/images/opengl/skybox.PNG "SkyBox"){: width="100%"}

## Instancing

One very useful technique in computer graphics is [instancing](https://en.wikipedia.org/wiki/Geometry_instancing). 

![]({{ site.baseurl }}/images/opengl/instancing.PNG "Instancing"){: width="100%"}

That part was very interesting but with that technique I had to adapt the way I sent information through my pipeline. 
First I had to create a `ModelMatrix` struct:  
```c++
struct ModelMatrices
{
    glm::mat4 model{};
    glm::mat4 normal{};

    void SetObject(
        glm::vec3 position = VEC3_ZERO, 
        glm::vec3 rotationAxis = VEC3_UP, 
        float angle = 0.0f,
        glm::vec3 scale = VEC3_ONE);
};
```

With that struct I would then set the objects matrices 

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
and set up the VBOs with this method:  

```c++
void Model::SetUpVBO(std::span<ModelMatrices> modelMatrices)
	{
		if (VBO != 0)
			glDeleteBuffers(1, &VBO);

		glGenBuffers(1, &VBO);
		glBindBuffer(GL_ARRAY_BUFFER, VBO);
		glBufferData(GL_ARRAY_BUFFER, static_cast<GLsizeiptr>(modelMatrices.size_bytes()), modelMatrices.data(),
		             GL_STATIC_DRAW);

		for (unsigned int i = 0; i < meshes.size(); i++)
		{
			glBindVertexArray(meshes[i].VAO);
			// set attribute pointers for matrix (4 times vec4)
			glEnableVertexAttribArray(3);
			glVertexAttribPointer(3, 4, GL_FLOAT, GL_FALSE, sizeof(ModelMatrices), nullptr);
			glEnableVertexAttribArray(4);
			glVertexAttribPointer(4, 4, GL_FLOAT, GL_FALSE, sizeof(ModelMatrices),
			                      reinterpret_cast<void*>(sizeof(glm::vec4)));
			glEnableVertexAttribArray(5);
			glVertexAttribPointer(5, 4, GL_FLOAT, GL_FALSE, sizeof(ModelMatrices),
			                      reinterpret_cast<void*>(2 * sizeof(glm::vec4)));
			glEnableVertexAttribArray(6);
			glVertexAttribPointer(6, 4, GL_FLOAT, GL_FALSE, sizeof(ModelMatrices),
			                      reinterpret_cast<void*>(3 * sizeof(glm::vec4)));

			glVertexAttribDivisor(3, 1);
			glVertexAttribDivisor(4, 1);
			glVertexAttribDivisor(5, 1);
			glVertexAttribDivisor(6, 1);

			glEnableVertexAttribArray(7);
			glVertexAttribPointer(7, 4, GL_FLOAT, GL_FALSE, sizeof(ModelMatrices),
			                      reinterpret_cast<void*>(sizeof(glm::mat4)));
			glEnableVertexAttribArray(8);
			glVertexAttribPointer(8, 4, GL_FLOAT, GL_FALSE, sizeof(ModelMatrices),
			                      reinterpret_cast<void*>(sizeof(glm::mat4) + sizeof(glm::vec4)));
			glEnableVertexAttribArray(9);
			glVertexAttribPointer(9, 4, GL_FLOAT, GL_FALSE, sizeof(ModelMatrices),
			                      reinterpret_cast<void*>(sizeof(glm::mat4) + 2 * sizeof(glm::vec4)));
			glEnableVertexAttribArray(10);
			glVertexAttribPointer(10, 4, GL_FLOAT, GL_FALSE, sizeof(ModelMatrices),
			                      reinterpret_cast<void*>(sizeof(glm::mat4) + 3 * sizeof(glm::vec4)));

			glVertexAttribDivisor(7, 1);
			glVertexAttribDivisor(8, 1);
			glVertexAttribDivisor(9, 1);
			glVertexAttribDivisor(10, 1);

			glBindVertexArray(0);
		}
	}
```
As you can see I use a `std::span<T>` so that I can directly get the `amount` of objects set in the `ModelMatrices` but also their `size()`. In that way I did not have to pass the previous elements in the method as parameters.

## Shadows

After instancing, that honestly took a certain time and a good mental workaround, I continued my learning by implementing [ShadowMapping](https://learnopengl.com/Advanced-Lighting/Shadows/Shadow-Mapping) 

![]({{ site.baseurl }}/images/opengl/shadow1.PNG "ShadowMapping"){: width="100%"}

used to render shadows from a directional light and [PointShadows](https://learnopengl.com/Advanced-Lighting/Shadows/Point-Shadows)

![]({{ site.baseurl }}/images/opengl/shadow2.PNG "PointShadows"){: width="100%"}

to render shadows from point lights.

## Deferred rendering

One of the modern techniques used in computer graphics is [DeferredRendering](https://learnopengl.com/Advanced-Lighting/Deferred-Shading). It is useful because, basically, you render all the geometry in a FrameBuffer with two shaders (vertex and fragment), commonly called the "Geometry pass", and then send all the data to the two other shaders, the "Lighting pass", thus saving the calculations of light for all pixels per object.

![]({{ site.baseurl }}/images/opengl/deferredShading.PNG "Deferred Shading"){: width="100%"}  

The implementation of the deferred rendering required to change the way the pipeline was functioning. Where in forward rendering we used to have two shaders (vertex & fragment) the deferred rendering required a buffer (gBuffer) and four shaders.  
Here the setting of the FrameBuffer:  
```c++
// configure g-buffer framebuffer
// ------------------------------
glGenFramebuffers(1, &gBuffer);
glBindFramebuffer(GL_FRAMEBUFFER, gBuffer);
// position color buffer
glGenTextures(1, &gPosition);
glBindTexture(GL_TEXTURE_2D, gPosition);
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA16F, SCREEN_WIDTH, SCREEN_HEIGHT, 0, GL_RGBA, GL_FLOAT, NULL);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, gPosition, 0);
// normal color buffer
glGenTextures(1, &gNormal);
glBindTexture(GL_TEXTURE_2D, gNormal);
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA16F, SCREEN_WIDTH, SCREEN_HEIGHT, 0, GL_RGBA, GL_FLOAT, NULL);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT1, GL_TEXTURE_2D, gNormal, 0);
// color + specular color buffer
glGenTextures(1, &gAlbedoSpec);
glBindTexture(GL_TEXTURE_2D, gAlbedoSpec);
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, SCREEN_WIDTH, SCREEN_HEIGHT, 0, GL_RGBA, GL_UNSIGNED_BYTE, NULL);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT2, GL_TEXTURE_2D, gAlbedoSpec, 0);
// tell OpenGL which color attachments we'll use (of this framebuffer) for rendering 
unsigned int attachments[3] = { GL_COLOR_ATTACHMENT0, GL_COLOR_ATTACHMENT1, GL_COLOR_ATTACHMENT2 };
glDrawBuffers(3, attachments);
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
As you see there are multiple attachments to this frame buffer used to store the data from the geometry pass (Position, Normal, Albedo and Specular) and then send them in `uniform` as `Sampler2D` (textures) to the lighting pass.

## PBR in Deferred Rendering

With deferred rendering in place, I wanted to implement [PBR](https://en.wikipedia.org/wiki/Physically_based_rendering) in my pipeline. To do so, I had to create a new texture and color attachment for my gBuffer:
```c++
//ARM
glGenTextures(1, &gARM);
glBindTexture(GL_TEXTURE_2D, gARM);
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA16F, SCREEN_WIDTH, SCREEN_HEIGHT, 0, GL_RGBA, GL_FLOAT, NULL);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT3, GL_TEXTURE_2D, gARM, 0);

unsigned int attachments[4] = {
    GL_COLOR_ATTACHMENT0, GL_COLOR_ATTACHMENT1, 
    GL_COLOR_ATTACHMENT2, GL_COLOR_ATTACHMENT3}

glDrawBuffers(4, attachments);

```
This texture "<span class="red">A</span><span class="green">R</span><span class="blue">M</span>" is used for the 
<span class="red">A</span>mbient Occlusion on the <span class="red">red</span> canal, 
the <span class="green">R</span>oughness on the <span class="green">green</span> canal and the 
<span class="blue">M</span>etallic on the <span class="blue">blue</span> canal. 
That also meant that in my geometry shader I had to get the textures from the `uniforms` and send them to the gBuffer:

```c++
#version 330 core
precision highp float;

//other layouts...
//...
layout (location = 3) out vec3 gARM;

//Inputs from the vertex shader
//...

//Other uniforms
//... 
uniform sampler2D texture_metallic1;
uniform sampler2D texture_roughness1;
uniform sampler2D texture_ao1;

void main()
{    
    //Other gBuffer settings
    //...

    // Ambient Roughness Metallic
    gARM.r = texture(texture_ao1, TexCoords).r;
    gARM.g = texture(texture_roughness1, TexCoords).r;
    gARM.b = texture(texture_metallic1, TexCoords).r;
}

```

With that done I got this nice result:

![]({{ site.baseurl }}/images/opengl/gBufferProblem.png "gBufferProblem"){: width="100%"}

The problem here was that since my other shaders weren't initially intended for PBR, they did not assign the correct textures and ended up using the objects positions as BaseColor.
Once that problem solved I was able to render 1000 backpacks with instancing, in deferred rendering, with PBR and forward rendering of light cubes.

![]({{ site.baseurl }}/images/opengl/deferredPbr.PNG "DeferredPBR"){: width="100%"}


## SSAO

Screen Space Ambient Occlusion [SSAO](https://learnopengl.com/Advanced-Lighting/SSAO), is a nice feature that simulates occlusion in constricted areas where light is not supposed to be able to reach. I'm not going to describe it more since many have already done it and probably better than I would. 
Overall implementing it was actually visually pleasant and not that hard to implement given the previous challenge.

With the deferred rendering for PBR it was quite easy to add a color attachment for the SSAO texture and adapt the pipeline with it. The only part that changed was that first I had to implement buffers for the actual SSAO and Bluring stages and then render the SSAO between the geometry pass and the lighting pass, linking the SSAO output to the gBuffer.

```c++
//SSAO
glGenTextures(1, &gSSAO);
glBindTexture(GL_TEXTURE_2D, gSSAO);
    //Note that we could have only used the RED canal (GL_RED)
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA16F, SCREEN_WIDTH, SCREEN_HEIGHT, 0, GL_RGBA, GL_FLOAT, NULL);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT4, GL_TEXTURE_2D, gSSAO, 0);

// tell OpenGL which color attachments we'll use (of this framebuffer) for rendering 
unsigned int attachments[5] = {
    GL_COLOR_ATTACHMENT0, GL_COLOR_ATTACHMENT1, GL_COLOR_ATTACHMENT2,
    GL_COLOR_ATTACHMENT3, GL_COLOR_ATTACHMENT4};

glDrawBuffers(5, attachments);

```
After adapting the pipeline to the SSAO and fighting with the different view/world/tangent space matrices the results where really satisfying.
Here you can see the SSAO result and the blurring of that one:  

SSAO | SSAO Blur
:-----:|:-----:
![]({{ site.baseurl }}/images/opengl/SSAO.PNG "SSAO"){: width="100%"} | ![]({{ site.baseurl }}/images/opengl/SSAO1.PNG "SSAO1"){: width="100%"}  

and the final result:  

![]({{ site.baseurl }}/images/opengl/SSAO2.png "SSAO1"){: width="100%"}

## IBL, Bloom and final touches

After doing all that work the results where looking good but I wanted to implement Image Based Lighting [IBL](https://en.wikipedia.org/wiki/Image-based_lighting), [Bloom](https://en.wikipedia.org/wiki/Bloom_(shader_effect)) and a little bit of UI to change settings in the scene.

To implement the IBL, I had to change my shaders to take in consideration the irradiance and create multiple other shader in order to create the different maps necessary to make it work. I'm not going to go into detail since the entire project is available but that was really not an easy subject.

For the bloom I basically had to do a last "post-processing" pass to bloom and blur the scene. On that part I had to create a FrameBuffer that enabled floating point colors and "final_bloom" shader that would apply a blooming effect and use [ACES](https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/) Knarkowicz tone mapping. One problem I had with all this was forgetting to include a depth buffer in it:
```c++
glGenFramebuffers(1, &hdrBuffer);
		glGenRenderbuffers(1, &hdrRBO);
		glBindFramebuffer(GL_FRAMEBUFFER, hdrBuffer);
		glBindRenderbuffer(GL_RENDERBUFFER, hdrRBO);
		glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT24, SCREEN_WIDTH, SCREEN_HEIGHT);
		glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, hdrRBO);
```
That meant that when I copied elements from my gBuffer to my hdrBuffer like this:
```c++
glBindFramebuffer(GL_READ_FRAMEBUFFER, gBuffer); //read from gBuffer
glBindFramebuffer(GL_DRAW_FRAMEBUFFER, hdrBuffer); // write to hdrFramebuffer.
		
// blit, copies from the gBuffer to the hdrBuffer
glBlitFramebuffer(0, 0,
	SCREEN_WIDTH, SCREEN_HEIGHT,
	0, 0,
	SCREEN_WIDTH, SCREEN_HEIGHT,
	GL_DEPTH_BUFFER_BIT, GL_NEAREST);
```
The elements where written but overrided by the enivronment cube used for my IBL lighting.  
With all that work done and only very little time left, I decided to implement some [ImGui](https://github.com/ocornut/imgui) features just 
to have fun with lights and wrap up the project before the deadline.

## Conclusion

I think overall that learning OpenGL was really a fun experience. Sometimes it was really frustrating and long to debug but if I had more time I would of loved to do much more: clean up the project, do some abstractions for better usability, implement [gltf](https://en.wikipedia.org/wiki/GlTF) and make it work, use [KTX](https://github.com/KhronosGroup/KTX-Specification) for my texture, implement Cascaded Shadow Maps [CSM](https://learnopengl.com/Guest-Articles/2021/CSM), add a job system to multithread loading and render a more furnished and better looking scene.  

Unfortunately when an exam is at stake giving in something, even if it is not as good as it could be, is better than doing better but giving nothing in the end.  
My only regret on this project is to not have had more time.

![]({{ site.baseurl }}/images/opengl/lastScene.PNG "LastScene"){: width="100%"}

The entire project can be found [here](https://github.com/SStyles93/opengl-scene).
