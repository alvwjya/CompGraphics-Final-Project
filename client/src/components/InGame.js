import React from "react";
import * as BABYLON from "@babylonjs/core";
import { TerrainMaterial, GridMaterial } from "@babylonjs/materials";
import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import "../App.css";

function onSceneReady(scene) {

  // Scene Physics

  scene.enablePhysics(null, new BABYLON.OimoJSPlugin());
  var PhysicsEngine = scene.getPhysicsEngine();
  PhysicsEngine.setGravity(new BABYLON.Vector3(0, -30, 0));

  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 10, -20), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(scene, true);

  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  var box = BABYLON.MeshBuilder.CreateBox("box", { width: 3, height: 1, depth: 6 }, scene);
  box.position.y = 30;
  box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0 }, scene);
  box.checkCollisions = true;
  box.physicsImpostor.physicsBody.angularDamping = 0.9;


  camera.parent = box;

  var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 1000, height: 1000 }, scene);
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.9, restitution: 0 }, scene);
  ground.checkCollisions = true;
  ground.material = new GridMaterial("mat", scene);


  var ramp = BABYLON.Mesh.CreateBox("ramp", 5, scene);
  ramp.rotation.x = Math.PI / 3;
  ramp.position.y -= 1;
  ramp.physicsImpostor = new BABYLON.PhysicsImpostor(ramp, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.9, restitution: 0 }, scene);




  var transformForce = function (mesh, vec) {
    var mymatrix = new BABYLON.Matrix();
    mesh.rotationQuaternion.toRotationMatrix(mymatrix);
    return BABYLON.Vector3.TransformNormal(vec, mymatrix);
  };

  var rotate = function (mesh, direction, power) {
    mesh.physicsImpostor.setAngularVelocity(
      mesh.physicsImpostor.getAngularVelocity().add(
        direction.scale(power)
      )
    );
  }

  var translate = function (mesh, direction, power) {
    mesh.physicsImpostor.setLinearVelocity(
      mesh.physicsImpostor.getLinearVelocity().add(
        transformForce(mesh, direction.scale(power))
      )
    );
  }


  var mf = false;
  var mb = false;
  var rl = false;
  var rr = false;


  window.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case 87://w
        box.physicsImpostor.friction = 1
        mf = true;
        break;
      case 83://s
        box.physicsImpostor.friction = 1
        mb = true;
        break;
      case 65://a
        rl = true;
        break;
      case 68://d
        rr = true;
        break;
    }
  });

  
  window.addEventListener('keyup', function (e) {
    switch (e.keyCode) {
      case 87://w
        box.physicsImpostor.friction = 2
        mf = false;
        break;
      case 83://s
        box.physicsImpostor.friction = 2
        mb = false;
        break;
      case 65://a
        rl = false;
        break;
      case 68://d
        rr = false;
        break;
    }
  });

  var linearVelocity;
  var angularVelocity;

  const forcePower = 1;
  const turnPower = 0.2;

  function update() {

    linearVelocity = Math.sqrt(box.physicsImpostor.getLinearVelocity().x ** 2 + box.physicsImpostor.getLinearVelocity().z ** 2);
    angularVelocity = Math.sqrt(box.physicsImpostor.getAngularVelocity().x ** 2 + box.physicsImpostor.getAngularVelocity().z ** 2);
  }

  scene.registerBeforeRender(function () {
    if (mf === true && linearVelocity < 50) {
      translate(box, new BABYLON.Vector3(0, 0, 1), forcePower);
    }
    if (mb === true && linearVelocity < 15) {
      translate(box, new BABYLON.Vector3(0, 0, -1), forcePower);
    }
    if (rl === true) {
      if (mf === true) {
        rotate(box, new BABYLON.Vector3(0, -1, 0), turnPower);
      }
      else if (mb === true) {
        rotate(box, new BABYLON.Vector3(0, 1, 0), turnPower / 1.5);
      }
    }
    if (rr === true && angularVelocity < 0.1) {
      if (mf === true) {
        rotate(box, new BABYLON.Vector3(0, 1, 0), turnPower);
      }
      else if (mb === true && angularVelocity < 0.1) {
        rotate(box, new BABYLON.Vector3(0, -1, 0), turnPower / 1.5);
      }
    }
    console.log()
    update();
  });

  return scene;
};



//Will run on every frame render.
function onRender(scene) {
  /*
    var canvas = scene.getEngine().getRenderingCanvas();
    var engine = new BABYLON.Engine(canvas, true);
    console.log(engine.getFps())
  */
};

export function InGame() {
  return (
    <div>
      <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
    </div>
  )
};
