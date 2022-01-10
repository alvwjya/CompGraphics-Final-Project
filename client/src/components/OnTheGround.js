import React from 'react';
import * as BABYLON from "@babylonjs/core";
import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import 'babylonjs-loaders'
import "../App.css";

function onGround(scene) {
  var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 10, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(scene, true);

  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;


  BABYLON.SceneLoader.ImportMesh("https://raw.githubusercontent.com/alviancode/CompGraphics-Final-Project/main/client/public/assets/models/", "barriers_final.babylon", scene, function (meshes) {
  const barriers = meshes[0]
    });

  return scene;
}

function onRender(scene) {
  /*
    var canvas = scene.getEngine().getRenderingCanvas();
    var engine = new BABYLON.Engine(canvas, true);
    console.log(engine.getFps())
  */
};

export function OnTheGround() {
  return (
    <div>
      <SceneComponent antialias onSceneReady={onGround} onRender={onRender} id="my-canvas" />
    </div>
  )
};