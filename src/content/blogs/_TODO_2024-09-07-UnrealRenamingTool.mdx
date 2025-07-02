---
title: Unreal Engine - Renaming Tool
categories: [Unreal Engine, Tool]
image: 
---

Explanation of a script made to rename and organize Unreal Engine projects

## Introduction

During my studies, I worked for projects at Styles Studio SàRL. During that time I sometimes had to integrate objects from divers origins into Unreal projects. Since the naming conventions weren't strictly established I often had to rename objects and folder.

Renaming a unique object isn't a problem, but when there are thousands it can be quite time consuming.
For that reason I decided to create a script that would automatically rename object according to the desired input.

## Installation

https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-editor-using-python?application_version=4.27

C:\Program Files\Epic Games\UE_5.3\Engine\Plugins\Experimental\PythonScriptPlugin\Content\Python

## Renaming script

### Code

```python
import unreal
import sys

def rename_assets(search_pattern, replace_pattern):

    # instances of unreal classes
    system_lib = unreal.SystemLibrary()
    editor_util = unreal.EditorUtilityLibrary()
    string_lib = unreal.StringLibrary()

    selected_assets = editor_util.get_selected_assets()
    num_assets = len(selected_assets)

    replaced = 0

    unreal.log("Selected {} asset/s".format(num_assets))

    for asset in selected_assets:
        asset_name = system_lib.get_object_name(asset)

        unreal.log(asset_name)
        if string_lib.contains(asset_name, search_pattern, use_case=False):
            replaced_name = string_lib.replace(asset_name, search_pattern, replace_pattern)
            editor_util.rename_asset(asset, replaced_name)

            replaced += 1
            unreal.log("Replaced {} with {}".format(asset_name, replaced_name))
        else:
            unreal.log("{} did not match the search pattern, was skipped".format(asset_name))

    unreal.log("Repalced {} of {} assets".format(replaced, num_assets))


rename_assets(sys.argv[1], sys.argv[2])
```

## Consolidation script

### Code
```python
import unreal
import sys
import os

editor_util = unreal.EditorUtilityLibrary()
editor_asset_lib = unreal.EditorAssetLibrary()
system_lib = unreal.SystemLibrary()
string_lib = unreal.StringLibrary()

def consolidate_to_file(TargetConsolidationFile):
#Get selected assets
    selected_assets = editor_util.get_selected_assets()

    for i in range(len(selected_assets)):

        #Get the first (only take one) OBJECT
        asset = []
        asset.append(selected_assets[i])
        unreal.log(asset)

        #object NAME
        name = asset[0].get_fname()
        unreal.log(name)

        path = asset[0].get_path_name()
        unreal.log(path)

        #result = source_path + "/Texture/{}".format(name) + ".uasset"
        #unreal.log(result)

        x = path.split("/")
        finalString = ""
        for i in range(len(x)-1):
            finalString += x[i] + "/"

        finalString += "{}".format(TargetConsolidationFile) + "/{}".format(name)
        #finalString = x[0] + "/"+ x[1] + "/" + x[2] + "/" + x[3] + "/Textures/{}".format(name)
        unreal.log(finalString)

        asset_to_consolidate_to = editor_asset_lib.find_asset_data(finalString).get_asset()
        unreal.log(asset_to_consolidate_to)

        editor_asset_lib.consolidate_assets(asset_to_consolidate_to, asset)

consolidate_to_file(sys.argv[1])
```