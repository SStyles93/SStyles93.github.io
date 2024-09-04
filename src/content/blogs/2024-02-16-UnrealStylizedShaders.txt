---
title: Unreal Stylized Shaders - Specialization projects
categories: [Graphic, UnrealEngine]
image: assets/images/ueshaderwork/FireFly.gif
---

Creating stylized shaders with a specific artistic direction in a student game project was the reason of the research and work exposed in this blogpost.

## Contextualization
During the last year of bachelor's degree in Game Programming at the SAE-Institute, the students of the Games Programming section had to create a game in collaboration with the Game Art and Audio Engineering sections. The purpose of the module was to simulate what was, for some, a first work experience in a professional-like environment.

For this project I had the opportunity to work as a Graphic Programmer on two game projects made in the Unreal Engine 5.3.

![]({{ site.baseurl }}/assets/images/ueshaderwork/GK_Map_01.PNG "GK_First_Map"){: width="100%"} _Project Girl & Kitty_ | ![]({{ site.baseurl }}/assets/images/ueshaderwork/VR_Map_01.PNG "VR_First_Map"){: width="100%"} _Project VR_

For both project we had a limited production time, roughly 8 months, with a team of 27 people.

The tasks I worked on were the following:
- Creation of [shaders](https://en.wikipedia.org/wiki/Shader) and functions to replicate a watercolor style
- Graphic tools for the artists
- Asset integration, colorization, test and review
- Creation of Landscape shaders, [Virtual Texturing](https://docs.unrealengine.com/4.26/en-US/RenderingAndGraphics/VirtualTexturing/)
- Creation of a stylized water shader
- Creation of specific objects shaders and code (Plant Growth, Glowing Outline, Vertex deformation)

The VR project, being [PBR](https://en.wikipedia.org/wiki/Physically_based_rendering) based, didn't require specific shaders. For that reason, the focus will be emphasized on the research, iterations and global work done for the Girl & Kitty project.

The first elements to acknowledge is the art direction. One of the references given for the art style was "Dordogne"

![]({{ site.baseurl }}/assets/images/ueshaderwork/Dordogne.PNG "Dordogne in game footage"){: width="100%"}

The only problem was that compared to Dordogne, a game made with hand-painted textures by "[Un je ne sais quoi](https://unjenesaisquoi.fr/)" a professional french studio, we didn't have as much time and would risk having incoherent texturing from the artists. For that reason a major part of the texturing was done with shaders.

## Shaders
In this blogpost, I am going to detail the steps of the major task I have been doing during these projects as a graphic programmer.

In this section the following shaders will be exposed and detailed: 
- [Stepped cell shading](#stepped-cell-shading)
- [Watercolor shader](#watercolor-shader)
- [Rim function](#rim-function)
- [Landscape and virtual texturing](#landscape-and-virtual-texturing)
- [Water shader](#water-shader)  

Multiple iterations were done before being validated by the "Art Director", the head of the Game Art section.
![]({{ site.baseurl }}/assets/images/ueshaderwork/GK_Iterations.PNG "Shader Iterations"){: width="100%"}

### Stepped cell shading
#### Cell shading function
Since a major part of stylized games use cell shading, that was the first shader I tried to produce.
After multiple tests using sequenced unreal `if` nodes, I finally created a custom [HLSL](https://en.wikipedia.org/wiki/High-Level_Shader_Language) shader using the [Custom unreal node](https://docs.unrealengine.com/5.2/en-US/custom-material-expressions-in-unreal-engine/).

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_CellShade.PNG "Cell Shader Material Function"){: width="100%"}

In this material function (MF_) I get the SkyAtmosphereLightDirection and do a dot product with the `VertexNormalWS` (see [Coordinates Expressions](https://docs.unrealengine.com/4.27/en-US/RenderingAndGraphics/Materials/ExpressionReference/Coordinates/)) to set a multiplication value of the BaseColor according to the position of the SkyLight. 

The node requires to explicitly add the `LightDirection`, `Basecolor` and `Steps` variables to the custom node.

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_CellShade_Var.PNG "Cell Shading Variables"){: width="50%"}

To use this material function it is necessary to branch the function as shown below:

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_CellShade_Use.PNG "How to use the Material Function"){: width="100%"}

The variables to input are:
- `BaseColor`: The object's color/texture
- `Exposure`: The value by which we want to multiply the final colors.
- `Steps`: The amount of desired separations 

#### HLSL code
The custom's node internal code was the following:

```c++
float3 col;
float T = 0;
int steps = Steps;
float Tstep = 1.0/steps;

for(int i = 0; i < steps; i++)
{
    if(LightDirection < T)
    {
        col = BaseColor * T;
        return col;
    }
     T += Tstep;
}

return BaseColor;
```
In this code, the `float3` "col" is the color that is returned at every iteration of the for loop.  
The `T` variable is the current value of a step.  
`Tstep` is the value of one step, obtained by dividing 1 by the amount of steps that are input.
`LightDirection` is the value of the vector that is evaluated to define the limitation of colors.

The `for` loop iterated until the amount of `steps` is met. Its content evaluates the `LightDirection` according to the current step `T`. If it is lower, the returned color is equal to the `BaseColor` multiplied by the step's value. The current step's value is then incremented by `Tstep`. When the `for` loop has ended the `BaseColor` is returned for the "non-shaded" parts.

#### Result
The result of this node used with plane white (1.0, 1.0, 1.0, 1.0) and 3 steps is the following:

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_CellShade_Result.PNG "Material Function result"){: width="100%"}

### Watercolor shader
#### Watercolor function
This shader had the principle task of replicating a watercolor effect on the assets in local/world space.
After multiple trials the final version of my shader was transformed in a material function to simplify it's modification.

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Watercolor.PNG "Watercolor Material Function"){: width="100%"}

This function gave the user the ability to change the watercolor effect of each material instance that used this material function.

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Watercolor_Params.PNG "watercolor shader use"){: width="100%"}

The different parameters are the following:
- `Metalness & Roughness`: Value between 0 and 1 to define these values.
- `Enable_Texture`: Enables the possibility to input a texture as `BaseColor`.
- `Enable_Second_color`: Enables the possibility to have a second color channel.
- `Second_Texture_Multiplier`: Changes the saturation value of the second texture

The `Second_` values are used with a Noise material function to give the diffusion effect to objects.

#### Noise function
The use of a noise function was the key element to have a "spreading" effect of both colors declared before
![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Noise.PNG "Noise Material Function"){: width="100%"}

The Noise parameters are the following: 
- `Noise_Scale_X & _Y`: Used to scale the given noise.
- `Black & White_Values`: Used to clamp the Black and White values of the given noise.
- `Noise_Texture`: The Noise used to "spread" colors.
- `Invert_Noise`: Inverts the black and white values of the Noise texture.

To use it in a Material, the `MF_Noise` is given as an alpha to a `Lerp` with the `BaseColors`.
![]({{ site.baseurl }}/assets/images/ueshaderwork/Watercolor_Use.PNG "Watercolor Use"){: width="100%"}

#### Result
The final result gives some sort of a color "spread" that is one of the key elements in the watercolor style.
![]({{ site.baseurl }}/assets/images/ueshaderwork/GK_Render.PNG "Boat with watercolor shader"){: width="100%"}

### Rim Shader
Since Dordogne has a specific outline on the characters that depends of the light source, I decided to create the same function in Unreal.

![]({{ site.baseurl }}/assets/images/ueshaderwork/dordogne.jpg "dordogne outline"){: width="100%"}

#### Rim Function
It was accomplished by using a `Fresnel Node` and subtracting it with the inverse of the dot between the light source and the `VertexNormalWS` (vertex normal world space) node.

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Rim.PNG "Rim material function"){: width="100%"}

To use it, connected it to either the `BaseColor` or the `Emissive Color`.

BaseColor | Emissive Color
:-----:|:-----:
![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Rim_Use.PNG "Rim function use BC"){: width="100%"} | ![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Rim_Use1.PNG "Rim function use EC"){: width="100%"}

#### Result
The final result connected to the `Emissive Color` of a plane white material was the following:

![]({{ site.baseurl }}/assets/images/ueshaderwork/Rim_Shader.gif "Dynamic rim shader"){: width="100%"}


### Landscape and virtual texturing
After discussion with a Game Artist friend participating in the project she pointed out the necessity of having a landscape material, that would blend vegetation and the ground seemingly.

My first step toward its creation was to read the Unreal Engine 5 documentation about [Landscape](https://docs.unrealengine.com/4.26/en-US/RenderingAndGraphics/Materials/ExpressionReference/Landscape/).

#### Landscape material
After reading the documentation, I got the `Landscape Coordinates` and broke them with the `BreakOutFloat2Component` node and multiplied each output with `Path_Tiling_X` and `Path_Tiling_Y` (2 exposed floats) to then [append](https://docs.unrealengine.com/4.27/en-US/RenderingAndGraphics/Materials/ExpressionReference/VectorOps/) them back together. That gave the possibility to scale the terrain's texture.

![]({{ site.baseurl }}/assets/images/ueshaderwork/VT_Path.PNG "Virtual Texturing Path base"){: width="100%"}

The same logic was applied to the grass layer.  
The `Landscape Coordinates`, after modification, were used as input for UVs of the `BaseColor` and the `Normal` of each layer.

The exposed variables for the `BaseColor` (_bc) were the following: 
- `Tint` multiplied each channel (R,G,B,A) by the given values.
- `Intensity` multiplied all channels uniformly.
- `Contrast` took every channel and powered it by the given value.
- `Saturation` used the [Desaturation](https://docs.unrealengine.com/4.27/en-US/RenderingAndGraphics/Materials/ExpressionReference/Color/) node. The input was inverted with the [OneMinus](https://docs.unrealengine.com/4.27/en-US/RenderingAndGraphics/Materials/ExpressionReference/Math/#oneminus) node just for better understanding by the artists.

Finally the [Saturate](https://docs.unrealengine.com/4.27/en-US/RenderingAndGraphics/Materials/ExpressionReference/Math/#saturate) node was to clamp all values between `0` and `1`.

For the `Normal` (_n), the only variable was the `Intensity` (inverted again) that was connected to a `FlattenNormal` node.

![]({{ site.baseurl }}/assets/images/ueshaderwork/VT_Grass.PNG "Virtual Texturing Grass base"){: width="100%"}

The output was then injected in a [Make Material Attribute](https://docs.unrealengine.com/5.0/en-US/material-attributes-expressions-in-unreal-engine/) node.

#### Virtual texturing
After the "normal" texture treatment part each layer was connected to a [Landscape Layer Blend](https://docs.unrealengine.com/5.0/en-US/landscape-material-layer-blending-in-unreal-engine/#landscapelayerblendnode) node. That node gave the possibility to link each texture to a defined landscape layer.
The [Break Material Attributes](https://docs.unrealengine.com/5.0/en-US/material-attributes-expressions-in-unreal-engine/#breakmaterialattributes) node that followed was used to connect the material output to the master node but also to connect it simultaneously to the [Runtime Virtual Texture Output](https://docs.unrealengine.com/5.0/en-US/runtime-virtual-texturing-in-unreal-engine/).

![]({{ site.baseurl }}/assets/images/ueshaderwork/VT_MakeMAT.PNG "Virtual Texturing make material"){: width="100%"}

That `Runtime Virtual Texture Output` node took all the parameters from the `Break Material Attributes` node except from the `Normal` that was translated from [Tangent Space](https://en.wikipedia.org/wiki/Tangent_space) to [World Space](https://learnopengl.com/Getting-started/Coordinate-Systems#:~:text=The%20coordinates%20in%20world%20space,preferably%20in%20a%20realistic%20fashion) and the `WorldHeight` that took the `Y` axis of the `Absolute World Position` with a `Mask` node.

![]({{ site.baseurl }}/assets/images/ueshaderwork/VT_RTVT.PNG "Virtual Texturing Run-time VirtualTexturing"){: width="100%"}

#### Grass Material

To have and interactive grass effect I started by creating a material with all the basics that my previous materials contained and adding a wind "function" that took divers variables for wind boost, weight, speed, direction, and so on... 

![]({{ site.baseurl }}/assets/images/ueshaderwork/M_Grass.PNG "Grass material wind"){: width="100%"}

The specificity of this material is its transformation from `Tangent Space` to `World Space` and back again, integrating the terrain blending between.

![]({{ site.baseurl }}/assets/images/ueshaderwork/VT_MatGeneral.PNG "Grass material general overview"){: width="100%"}

For the blending, the material takes the `Virtual Texture`'s parameters and will blend them according to the `VirtualBlendHeight` and `VirtualFalloff` parameters.

![]({{ site.baseurl }}/assets/images/ueshaderwork/VT_Mat.PNG "Grass material texture blend"){: width="100%"} _Grass material texture blend_ | ![]({{ site.baseurl }}/assets/images/ueshaderwork/VT_MatBlend.PNG "Grass material height blend"){: width="100%"} _Grass material height blend_

The last part of the material is just breaking every material attribute and re-assigning them to the master node.

![]({{ site.baseurl }}/assets/images/ueshaderwork/VT_MatGeneral2.PNG "Grass material break and assign"){: width="50%"}

#### Setup, integration and use

Once the Materials done I created a Landscape [Material Instance](https://docs.unrealengine.com/5.0/en-US/creating-and-using-material-instances-in-unreal-engine/#creatingametrialinstance), that had to be created per map, and [Landscape Layers](https://docs.unrealengine.com/4.26/en-US/BuildingWorlds/Landscape/Materials/).

![]({{ site.baseurl }}/assets/images/ueshaderwork/M_Landscape.PNG "Material Instance creation"){: width="50%"} _Material Instance creation_ | ![]({{ site.baseurl }}/assets/images/ueshaderwork/M_Landscape_Layer.PNG "Landscape Layers"){: width="100%"} _Landscape Layers_

Then, I just followed the Unreal documentation to setup my maps.  
From the Landscape creation and connecting the Layers

![]({{ site.baseurl }}/assets/images/ueshaderwork/M_Landscape_Creation.PNG "Landscape creation"){: width="100%"} _Landscape creation_ | ![]({{ site.baseurl }}/assets/images/ueshaderwork/M_Landscape_Layer_Plug.PNG "Landscape Layer plug"){: width="100%"} _Landscape Layer connection_

To the [Runtime Virtual Texture Volume](https://docs.unrealengine.com/5.0/en-US/runtime-virtual-texturing-in-unreal-engine/) that was bound to the Landscape and finally painting the Map

![]({{ site.baseurl }}/assets/images/ueshaderwork/M_Landscape_VT.PNG "Runtime Virtual Texture Volume"){: width="100%"} _Runtime Virtual Texture Volume_ | ![]({{ site.baseurl }}/assets/images/ueshaderwork/M_Landscape_Draw.PNG "Landscape Painting"){: width="100%"} _Landscape Painting_

#### Result
Thanks to all this process and the materials previously created the level artists were able to create landscapes and paint them with their desired texture, integrate foliage in the scene and modify at their blending at their convenience.

![]({{ site.baseurl }}/assets/images/ueshaderwork/VT_Blend.gif "Virtual Texturing blend"){: width="100%"}

### Water shader

One of the game mechanics was the ability to use a boat and navigate on water, for that reason I created a water material that you can overview below.
![]({{ site.baseurl }}/assets/images/ueshaderwork/M_Water.PNG "Water material"){: width="100%"}

#### Water color
The base color component of it was a `Lerp` between two exposed colors with a [Depth Fade](https://docs.unrealengine.com/4.27/en-US/RenderingAndGraphics/Materials/ExpressionReference/Depth/#depthfade) node in the `Alpha` chanel. That enabled a transition between the lighter and darker parts of the water.
![]({{ site.baseurl }}/assets/images/ueshaderwork/M_Water_Colour.PNG "Water material colour"){: width="100%"}

#### Shorelines
To simulate stylized shorelines a `DistanceToNearestSurface` node was used with the `AbsoluteWorldPosition` node so that the intersection of meshes would be detected and create lines on the water plane at a defined distance. A `Time` node was then used to be able to change their position on the water plane.
![]({{ site.baseurl }}/assets/images/ueshaderwork/M_Water_Shoreline.PNG "Water material shoreline distance"){: width="100%"}

So that the shoreline wouldn't be static two identic distortion functions where created taking different noise textures and parameters, those parameters are self explanatory. The only specificity was the [panner](https://docs.unrealengine.com/4.27/en-US/RenderingAndGraphics/Materials/HowTo/AnimatingUVCoords/#pannernodebreakdown) node that gave me the possibility to displace UV's without creating a node or function for that.
![]({{ site.baseurl }}/assets/images/ueshaderwork/M_Water_ColourDistortion.PNG "Water material shoreline distortion 1&2"){: width="100%"}

#### Normal distortion
At that point the shorelines were acceptable but the water did not have any kind of movement to it, for that reason I created a distortion effect of the normal taking the previously generated noise from the shoreline distortion. Different parameters where exposed to be able to control the effect from material instances.
![]({{ site.baseurl }}/assets/images/ueshaderwork/M_Water_NormalDistortion.PNG "Water material normal distortion"){: width="100%"}

#### Tweaking iterations
Due to a lack of time, a big part of the shader was just iterations of multiple shoreline assembly until the result was pleasing. For that reason I am not going to go in depth in this part of the node. With the previous parts any replication can be adapted according to preferences.
![]({{ site.baseurl }}/assets/images/ueshaderwork/M_Water_Tweaking.PNG "Water material tweaking"){: width="100%"}

The final part of the node was assembled with two `Lerp` nodes that took in account the shorelines, one for the base color and the other for the opacity chanel with again a `Depth Fade` node. The normal distortion was just directly connected to the master node. 
![]({{ site.baseurl }}/assets/images/ueshaderwork/M_Water_MasterNode.PNG "Water material master node"){: width="100%"}

#### Result
The shader probably could have been much better, taking the movement of objects in consideration per example, but the final result was nevertheless quite pleasing and satisfied the team that was working on the project.
![]({{ site.baseurl }}/assets/images/ueshaderwork/M_Water_Result.gif "Water material result in game"){: width="100%"}

### Post Processing
For this part of the blog post, we are not going to go in depth trough the work process since it is not the intended focus point. Instead a simple overview of the final shader's state will be exposed.
#### Kuwahara function
The idea of using a post processing shader came first of all from the necessity of having a screen space effect that would give a diffusion of color between objects in a scene. To accomplish that effect a simple shader using [HLSL](https://fr.wikipedia.org/wiki/High-Level_Shading_Language) was created to obtain a [Kuwahara](https://en.wikipedia.org/wiki/Kuwahara_filter) filter effect in screen space.  
The Unreal Engine material node looked like this:

![]({{ site.baseurl }}/assets/images/ueshaderwork/GK_KuwaharaNode.PNG "Kuwahara filter node in UnrealEngine 5.3"){: width="100%"}

#### HLSL code
The HLSL code was the following:

```c++
float3 mean[4] = 
{
    {0, 0, 0},
    {0, 0, 0},
    {0, 0, 0},
    {0, 0, 0}
};
float3 sigma[4] = 
{
    {0, 0, 0},
    {0, 0, 0},
    {0, 0, 0},
    {0, 0, 0}
};
float2 offsets[4] = 
{
    {-RADIUS, -RADIUS}, 
    {-RADIUS, 0}, 
    {0, -RADIUS}, 
    {0, 0};
}
float2 pos;
float3 col;
for(int i = 0; i < 4; i++){
    for(int j = 0; j <= RADIUS; j++){
        for(int k = 0; k <= RADIUS; k++){
            pos = float2(j,k) + offsets[i];
            float2 uvpos = UV + pos/VIEWSIZE;
            col = SceneTextureLookup(uvpos, 14, false);

            mean[i] += col;
            sigma[i] += col * col;
        }
    }
}

float n = pow(RADIUS + 1, 2);
float sigma_f;
float min = 1;
for(int l = 0; l < 4; l++)
{
    mean[l] /= n;
    sigma[l] = abs(sigma[l] / n - mean[l] *  mean[l]);
    sigma_f = sigma[l].r + sigma[l].g + sigma[l].b;

    if(sigma_f < min){
        min = sigma_f;
        col = mean[l];
    }
}
return col;
```

#### Use
To use it, we just had to create a [PostProcessVolume](https://docs.unrealengine.com/5.0/en-US/post-process-effects-in-unreal-engine/) in the scene and plug it in "Rendering Features -> Post Process Materials -> Array"

![]({{ site.baseurl }}/assets/images/ueshaderwork/GK_PP_use.PNG "Kuwahara filter use"){: width="100%"}

#### Result
Here you can see the result of the post processing shader being used:

![]({{ site.baseurl }}/assets/images/ueshaderwork/GK_KuwaharaFilter.gif "Kuwahara filter effect"){: width="100%"}

## Final result
After a lot of research, watching youtube videos, reading the UnrealEngine 5 documentation, reading blogs; exchanges with colleges and teachers; multiples trials and errors, the final result looked pleasing. It probably did not really reproduce the desired watercolor effect, at least not as a hand made painting could have been done, but it certainly gave a good style to the environment and a real "vibe" to it.

![]({{ site.baseurl }}/assets/images/ueshaderwork/Final_Result.gif "Final Scene"){: width="100%"}
_Scene evolution_
