---
title: Unreal Dynamic Shaders - Specialization projects
categories: [Graphic, UnrealEngine]
image: assets/images/ueshaderwork/Outline_Use.gif
---

The necessity of creating interactive visual effects in an Unreal Engine game resulted in this research, the work that followed and finally this blogpost.

## Contextualization

During the last year of bachelor's degree in Game Programming at the SAE-Institute, the students of the Games Programming section had to create a game in collaboration with the Game Art and Audio Engineering sections. The purpose of the module was to simulate what was, for some, a first work experience in a professional-like environment.

For this module I had the opportunity to work as a Graphic Programmer on two game projects made in the Unreal Engine 5.3.
The project that demanded the most work in terms of shader creation was first first know as "The Project Girl & Kitty".
![]({{ site.baseurl }}/assets/images/ueshaderwork/GK_Map_01.PNG "GK_First_Map"){: width="100%"}
_Project Girl & Kitty Scene render_

For both project we had a limited production time, roughly 8 months, with a team of 27 people.
The tasks I worked on were the following:
- Project producing
- Creation of [shaders](https://en.wikipedia.org/wiki/Shader) and functions to replicate a watercolor style
- Creation of Landscape shaders, [Virtual Texturing](https://docs.unrealengine.com/4.26/en-US/RenderingAndGraphics/VirtualTexturing/)
- Creation of a stylized water shader
- Asset integration, colorization, test and review
- Creation of specific object's shaders and code (Plant Growth, Glowing Outline, Vertex deformation)
- Graphic tools for the artists

In this blogpost, I am going to detail the work done towards the creation of the following interactive shaders:
- [Outlining shader](#outlining-shader)
- [Distortion shader](#distortion-shader)
- [Fading shader](#fading-shader)

## Interactive class and dynamic materials

Before going in detail into the shader creation, the first thing to acknowledge is that in Unreal Engine, you can not modify objects materials in run-time since they are static. For that reason I had to code an "Interactable" component class so that every object that had it would override its materials and create a dynamic version of them.  

Below you can see the `Interactable.h` code related to the dynamic material creation:
The `Interactable.h` file:
```c++
#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "Interactable.generated.h"


UCLASS( ClassGroup=(Custom), meta=(BlueprintSpawnableComponent) )
class PROJECTGIRLANDKITTY_API UInteractable : public UActorComponent
{
	GENERATED_BODY()

public:	

	UInteractable();

	//...
	
protected:

	virtual void BeginPlay() override;


private:
	
	TArray<UMaterialInstanceDynamic*> DynMaterials;

    //...
};
```
As you can see the `DynMaterials` is an `Array` that stores the materials created at run-time.

And the `Interactable.cpp` file:
```c++
#include "Interactable.h"

UInteractable::UInteractable()
{
	//...
}

void UInteractable::BeginPlay()
{
	Super::BeginPlay();

	TArray<UStaticMeshComponent*> Meshes;
	GetOwner()->GetComponents<UStaticMeshComponent>(Meshes, true);
	for (int32 i = 0; i < Meshes.Num(); i++)
	{
		UStaticMeshComponent* StaticMeshComponent = Meshes[i];
		UMaterialInterface* Material = StaticMeshComponent->GetMaterial(0);
		UMaterialInstanceDynamic* DynMaterial = UMaterialInstanceDynamic::Create(Material, GetOuter());
		DynMaterials.Add(DynMaterial);
		StaticMeshComponent->SetMaterial(0, DynMaterial);
	}

	//...
}
```
The code above takes all the `Meshes` and creates a dynamic material instance for each of them and stores it in the `DynMaterials` array.
Thanks to this unreal component class, all exposed variables in the materials were accessible via code or blueprint.

## Shaders
### Outlining shader
#### Outline function
The necessity to have a dynamic outline, that reacted to the players position and rotation when he crossed interactable objects, brought me to create this "Coloured_Outline" Shader.
Using the `Fresnel`, `Time` & `Sine` Nodes I first created an "Emissive" effect.

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Outline_Colour.PNG "MF_Coloured_Outline"){: width="100%"}

The `Enable_Outline` parameter (float) is used in the C++ code to activate it or not. I first tried using a `Static bool` parameter but after research, since it is static, you can not modify it in code thus rendering it's activation impossible. 

The MF_Outline is the base function used to create the outline of objects. It colors every part of an object that has a normal direction, according to the camera's position, with a value superior to the `Outline_Thickness`.

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Outline.PNG "MF_Outline"){: width="100%"}

#### C++ code

Once the shader done, I had to create the methods that would be used in game to enable and modify the outline.
Below is the code related to the Outline of the "Interactable" objects:

 Interactable.h
```c++
UCLASS( ClassGroup=(Custom), meta=(BlueprintSpawnableComponent) )
class PROJECTGIRLANDKITTY_API UInteractable : public UActorComponent
{
public:	
	//...
	UPROPERTY(EditAnyWhere, BlueprintReadWrite, Category = "Visuals|Outline", meta = (AllowPrivateAccess = "true"))
	bool EnableOutline = false;
	//...
private:
	
	//...
	
	UPROPERTY(EditAnyWhere, BlueprintReadWrite, Category = "Visuals|Outline", meta = (AllowPrivateAccess = "true", ClampMin = "0.0", ClampMax = "1.0", UIMin = "0.0", UIMax = "1.0"))
	float MaxOutlineThickness = 0.3f;
	UPROPERTY(EditAnyWhere, Category = "Visuals|Outline", meta = (AllowPrivateAccess = "true"))
	float OutlineThickness = 0.0f;	
	UPROPERTY(EditAnyWhere, Category = "Visuals|Outline", meta = (AllowPrivateAccess = "true"))
	float CurrentOutlineValue = 0.0f;
	//This float is used instead of a bool since materials only have static bools
	float OutlineEnabled = 0.0f;

	void SetOutline(float value);

	//...
};
```
The public property of the `EnableOutline` variable gave the access to its activation/deactivation from anywhere without having to worry about the fact that it was actually a float.
The `MaxOutlineThickness` was the only value that was exposed to modification on blueprints. 

In the `.cpp` file the modification of the outline values were done with a [Conditional operator](https://en.cppreference.com/w/c/language/operator_other#Conditional_operator). When enabled/disabled with the `EnableOutline` bool the OutlineThickness would be evaluated and gradually incremented/decremented by the `DeltaTime` until it reached the `MaxOutlineThickness`/`0.0` value.

Interactable.cpp
```c++ 
void UInteractable::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
	Super::TickComponent(DeltaTime, TickType, ThisTickFunction);
	
	if (EnableOutline)
	{

		OutlineThickness >= MaxOutlineThickness ? OutlineThickness = MaxOutlineThickness : OutlineThickness += DeltaTime;
		OutlineEnabled = 1.0f;
	}
	else
	{
		OutlineThickness <= 0.0f ? OutlineThickness = 0.0f : OutlineThickness -= DeltaTime;
		OutlineEnabled = 0.0f;
	}
	if (CurrentOutlineValue != OutlineThickness)
	{
		CurrentOutlineValue = OutlineThickness;
		SetOutline(OutlineThickness);
	}
}
```
Then, to avoid un-useful work every frame, the `OutlineThickness` would be evaluated with the `CurrentOutlineValue` and if it had changed, the `SetOutline` method would be called and the values previously mentioned would be equalized.

```c++
/// <summary>
/// Sets the Outline Thickness
/// </summary>
/// <param name="Value">The value of the outline thickness</param>
void UInteractable::SetOutline(float value)
{
	for (auto& DynMat : DynMaterials)
	{
		DynMat->SetScalarParameterValue("Outline_Thickness", value);
		DynMat->SetScalarParameterValue("Enable_Outline", OutlineEnabled);
	}
}
```
The `SetOutline` method above gets the dynamic materials parameters by string and changes their values. In this case the `Outline_Thickness` is changed with the `value` parameter and the `Enable_Outline` is set with the classes variable `OutlineEnabled`.

#### Result

In the end, I also linked an [Unreal Material Parameters Collection](https://docs.unrealengine.com/4.26/en-US/RenderingAndGraphics/Materials/ParameterCollections/) to it. The idea was to give the artist the possibility to change its color in a simple "Color palette" for that purpose 

![]({{ site.baseurl }}/assets/images/ueshaderwork/Outline_Use.gif "Outline Use"){: width="100%"}

### Distortion shader
#### Distortion function
The distortion function was a function that just took the `Time`, `Panner` and `VertexNormalWS` nodes with a Normal map in a `TextureParameter2D` node to deform the object.

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Distortion.PNG "Distortion MF"){: width="100%"}

The only specificity was to multiply the `R` and `G` channels by the `Distortion_Power`, that was controlled in the C++ code, so that the effect could be enabled or not.

To use it I had to branch it to world position offset in the object's material node.

![]({{ site.baseurl }}/assets/images/ueshaderwork/Distortion_Use.PNG "Distortion MF Use"){: width="100%"}

#### C++ code

Similarly to the Outline shader, the distortion also required its variables and methods.  
Below you can find the code related to the distortion in the `.h` file:
```c++
//...
//The rest of the Interactable.h file
//...

private:

	bool tempDistortionState = false;
	UPROPERTY(EditAnyWhere, BlueprintReadWrite, Category = "Visuals|Distortion", meta = (AllowPrivateAccess = "true", ClampMin = "0.0", ClampMax = "100.0", UIMin = "0.0", UIMax = "100.0"))
	float DistortionPower = 20.0f;
	UPROPERTY(EditAnyWhere, BlueprintReadWrite, Category = "Visuals|Distortion", meta = (AllowPrivateAccess = "true"))
	float DistortionSpeed = 0.25f;
	UPROPERTY(EditAnyWhere, BlueprintReadWrite, Category = "Visuals|Distortion", meta = (AllowPrivateAccess = "true", ClampMin = "-1.0", ClampMax = "1.0", UIMin = "-1.0", UIMax = "1.0"))
	float DistortionDirectionX = 0.0f;
	UPROPERTY(EditAnyWhere, BlueprintReadWrite, Category = "Visuals|Distortion", meta = (AllowPrivateAccess = "true", ClampMin = "-1.0", ClampMax = "1.0", UIMin = "-1.0", UIMax = "1.0"))
	float DistortionDirectionY = 0.03f;

	//...

	void SetDistortion(bool value);
	void SetDistortionValues();

	//...

```


and in the `.cpp` file: 
```c++
//...

void UInteractable::BeginPlay()
{
	Super::BeginPlay();

	//...

	SetDistortionValues();
}

void UInteractable::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
	Super::TickComponent(DeltaTime, TickType, ThisTickFunction);

    //...

#if WITH_EDITOR
	SetDistortionValues();
#endif

	if (tempDistortionState != EnableDistortion)
	{
		SetDistortion(EnableDistortion);
		tempDistortionState = EnableDistortion;
	}
}
```

The method `SetDistortionValues()` was used to set the materials values defined by blueprint, for that reason I used the `#if WITH_EDITOR //code #endif` statement to be able to change them at run time in editor. The code would then be ignored in the built version.

```c++
/// <summary>
/// Sets the value of distortion for the Interactable Shaders
/// </summary>
void UInteractable::SetDistortionValues()
{
	for (auto& DynMat : DynMaterials)
	{
		DynMat->SetScalarParameterValue("Distortion_Speed", DistortionSpeed);
		DynMat->SetScalarParameterValue("Distortion_Power_X", DistortionDirectionX);
		DynMat->SetScalarParameterValue("Distortion_Power_Y", DistortionDirectionY);
	}
}
```

Below the `SetDistortion(bool value)` method changed the state of activation of all dynamic material on the objects.
```c++
/// <summary>
/// Sets the state of the distortion effect
/// </summary>
/// <param name="value">True = Enabled</param>
void UInteractable::SetDistortion(bool value)
{
	switch (value)
	{
	case true:
		for (auto& DynMat : DynMaterials)
		{
			DynMat->SetScalarParameterValue("Distortion_Power", DistortionPower);
		}
		break;
	case false:
		for (auto& DynMat : DynMaterials)
		{
			DynMat->SetScalarParameterValue("Distortion_Power", 0.0f);
		}
		break;
	}
}
```

#### Result

Here you can see the result after branching the material function to the materials and calling the methods with code/blueprints:

![]({{ site.baseurl }}/assets/images/ueshaderwork/Distortion_Use.gif "Distortion Use"){: width="100%"}

### Fading shader
#### Fading function

The last dynamic shader I did was to be able to have magical plants growing when the player arrived in a defined area.  

For the shader, I created a material function that took the `V` Coordinates (Y axis) from the textures' `UV` (`TextCoord[0]`) with the `Mask` node and then applied a condition (`if` node) to check if the coordinated where below a certain value.  

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Fade.PNG "Fade material function"){: width="100%"}

Then the material function was linked to a material's Opacity Mask. The material's Blend Mode just had to be set to `Masked`.

:----:|:----: 
![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Fade_Use.PNG "Fade material function link"){: width="100%"} | ![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Fade_Condition.PNG "Material parameter"){: width="100%"}

#### Blueprint code

As for the previous shaders, I had to create the code to activate the fading effect. The only difference was that, due to the diversity of possible plants, I had to manually select the meshes on which the effect has going to be applied. For that reason I created the same `Begin()` function but in blueprint.  
![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Fade_DynMat.PNG "Fade Even Begin"){: width="100%"}

The `Create Dynamic Fade Material` function replicated what had been done in the previous C++ codes using a [Blueprint Function Library](https://docs.unrealengine.com/4.27/en-US/ProgrammingAndScripting/ProgrammingWithCPP/BlueprintFunctionLibraries/).

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Fade_DynMatFunction.PNG "Create dynamic mat function"){: width="100%"}

The next step was to code the detection. To be sure that only the player could activate it with the main character, I checked by tag if the colliding element was effectively the player.  
I also exposed a variable of type `Trigger Base` that gave the possibility to assign a trigger from outside the blueprint.

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Fade_CollisionDetection.PNG "Collision detection"){: width="100%"}

That gave the possibility to select a trigger directly in the editor, for multiple objects at the same time and not have to change a collider inside this blueprint.

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Fade_CollisionSelection.PNG "Collision selection"){: width="100%"}

Since this was a plant, the effect wouldn't have been visually pleasing if every material was activated at the same time. For that reason I had to sequence the activation with this part of the node:

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Fade_Sequence.PNG "Sequenced activation"){: width="100%"}

First of all, when the trigger was activated, the first element in my `DynMats` array would update its `Fade_Amount` value according to the [Timeline](https://docs.unrealengine.com/5.3/en-US/timelines-in-unreal-engine/).

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Fade_Timeline.PNG "UETimeline"){: width="100%"}

Then, when finished, the `Mat_Index` was incremented and the next material was updated with the same logic until there were no more material to update.

#### Lighting

The last element of the blueprint I coded was lighting and emissive. Inspired by the same process I made an array of lights

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Fade_Light.PNG "Light Array"){: width="100%"}

and set their intensity, with a few control variables, once all meshes had appeared.

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Fade_LightSet.PNG "Light Set"){: width="100%"}

Finally I set an emissive on the petals to correspond to the enlightenment.

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Fade_EmissiveSet.PNG "Emissive Set"){: width="100%"}

#### Result

In the end, even though it took a certain amount of time and iteration, the effect looked really good but was also very easy to use and modify in the editor.

![]({{ site.baseurl }}/assets/images/ueshaderwork/MF_Fade_Final.gif "Plant Growth"){: width="100%"}


## Conclusion

To conclude this blogpost I would say that, even though this work wasn't really relative to Graphic programming, it has taught me a lot regarding Unreal Engine 5, its interface, the materials and the hierarchy behind them, the tools and possibilities available.  

Since I was more used to Unity, having to use the system of dynamic materials was really complicated to understand and work with at the beginning but, in the end, I think that what I have learned was really valuable and has trained me to get used to a different interface and way of doing things. Overall it was really an interesting project to work on and I feel proud of what I was able to accomplish giving the fact that I had no knowledge of Unreal's material system before.
