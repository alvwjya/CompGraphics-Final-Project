import React from "react";
import * as BABYLON from "@babylonjs/core";
import { TerrainMaterial, GridMaterial } from "@babylonjs/materials";
import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import 'babylonjs-loaders'
import "../App.css";

function onSceneReady(scene) {

  /* ----------Scene Physics---------- */

  scene.enablePhysics(null, new BABYLON.OimoJSPlugin());
  var PhysicsEngine = scene.getPhysicsEngine();
  PhysicsEngine.setGravity(new BABYLON.Vector3(0, -30, 0));



  /* ----------Camera---------- */

  // Debug Camera
  var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 10, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(scene, true);

  // Final Camera
  /*
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 10, -20), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(scene, true);
  */



  /* ----------Light---------- */
  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;



  /* ----------Car---------- */

  // Car hit box dimension
  const carWidth = 3.2;
  const carDept = 8;
  const carHeight = 1

  // Create car hit box
  var car = BABYLON.MeshBuilder.CreateBox("car", { width: carWidth, height: carHeight, depth: carDept }, scene);

  var hitBoxMat = new BABYLON.StandardMaterial("hitBoxMat");  // Hitbox material
  hitBoxMat.alpha = 0;  // Make hit box transparent

  car.material = hitBoxMat;  // Apply material


  // Load car mesh
  BABYLON.SceneLoader.ImportMesh("", "assets/", "car.babylon", scene, function (newMeshes) {
    const body = newMeshes[0];
    body.scaling = new BABYLON.Vector3(1.8, 1.8, 1.8);
    body.position.y = -0.5
    body.rotation.y = Math.PI;

    var carMat = new BABYLON.StandardMaterial("carMat");
    body.material = carMat;

    body.parent = car;
  });

  car.position.y = 30; // Car initial location

  // Enable car physics
  car.physicsImpostor = new BABYLON.PhysicsImpostor(car, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0 }, scene);
  car.checkCollisions = true;
  car.physicsImpostor.physicsBody.angularDamping = 0.9;



  /* ----------wheel---------- */

  // Define wheel faces
  var wheelUV = [];
  wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
  wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
  wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

  // Wheel material
  var wheelMat = new BABYLON.StandardMaterial("wheelMat");
  wheelMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/wheel.png");


  // Create wheel
  const wheelFR = BABYLON.MeshBuilder.CreateCylinder("wheelRB",
    {
      diameter: 1.25,
      height: 0.6,
      faceUV: wheelUV
    });

  // Create Pivot
  var pivotFR = new BABYLON.Mesh("pivotFR", scene);
  pivotFR.parent = car;
  pivotFR.position.z = (carDept / 2 - (1.458));
  pivotFR.position.x = ((carWidth / 2) - 0.2);
  pivotFR.position.y = 0.1;

  var pivotFL = new BABYLON.Mesh("pivotFL", scene);
  pivotFL.parent = car;
  pivotFL.position.z = (carDept / 2 - (1.458));
  pivotFL.position.x = -((carWidth / 2) - 0.2);
  pivotFL.position.y = 0.1;


  // position for wheel Front Right
  wheelFR.material = wheelMat;
  wheelFR.parent = pivotFR;
  wheelFR.rotation.z = Math.PI / 2

  // position for wheel Front Left
  var wheelFL = wheelFR.createInstance("wheelFL");
  wheelFL.parent = pivotFL;

  // position for wheel Back Right
  var wheelBR = wheelFR.createInstance("wheelRB");
  wheelBR.position.x = ((carWidth / 2) - 0.2);
  wheelBR.position.z = -(carDept / 2 - (1.8));
  wheelBR.position.y = 0.1;
  wheelBR.parent = car;

  // position for wheel Back Left
  var wheelBL = wheelFR.createInstance("wheelBL");
  wheelBL.position.x = -((carWidth / 2) - 0.2);
  wheelBL.position.z = -(carDept / 2 - (1.8));
  wheelBL.position.y = 0.1;
  wheelBL.parent = car;

  // Make camera follow car
  camera.parent = car;



  /* ----------Ground---------- */

  // Create ground
  var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 1000, height: 1000 }, scene);

  // Enable ground physics
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.9, restitution: 0 }, scene);
  ground.checkCollisions = true;
  var groundMat = new BABYLON.StandardMaterial("groundMat")
  //ground.material = new GridMaterial("mat", scene);
  groundMat.diffuseTexture = new BABYLON.Texture("https://pbs.twimg.com/media/EDieypNW4AURSe5.jpg");
  ground.material = groundMat;

  // Create ramp
  var ramp = BABYLON.Mesh.CreateBox("ramp", 5, scene);
  ramp.rotation.x = Math.PI / 3;
  ramp.position.y -= 1;

  // Enable ramp physics
  ramp.physicsImpostor = new BABYLON.PhysicsImpostor(ramp, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.9, restitution: 0 }, scene);


  /* ----------Movement Physics---------- */

  // Forward & Backward force function
  function translate(mesh, direction, power) {
    mesh.physicsImpostor.setLinearVelocity(
      mesh.physicsImpostor.getLinearVelocity().add(
        transformForce(mesh, direction.scale(power))
      )
    );
  }

  // Transform force to matrix
  function transformForce(mesh, vec) {
    var mymatrix = new BABYLON.Matrix();
    mesh.rotationQuaternion.toRotationMatrix(mymatrix);
    return BABYLON.Vector3.TransformNormal(vec, mymatrix);
  };

  // Turning function
  function rotate(mesh, direction, power) {
    mesh.physicsImpostor.setAngularVelocity(
      mesh.physicsImpostor.getAngularVelocity().add(
        direction.scale(power)
      )
    );
  }


  // Keyboard value
  var mf = false;
  var mb = false;
  var rl = false;
  var rr = false;

  var direction = 1;


  /* ----------Keyboard Controller---------- */

  // Key pressed down
  window.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case 87: //w
        car.physicsImpostor.friction = 1
        mf = true;
        break;
      case 83: //s
        car.physicsImpostor.friction = 1
        mb = true;
        break;
      case 65: //a
        rl = true;
        break;
      case 68: //d
        rr = true;
        break;
    }
  });

  // Key released
  window.addEventListener('keyup', function (e) {
    switch (e.keyCode) {
      case 87: //w
        car.physicsImpostor.friction = 2
        mf = false;
        break;
      case 83: //s
        car.physicsImpostor.friction = 2
        mb = false;
        break;
      case 65: //a
        rl = false;
        break;
      case 68: //d
        rr = false;
        break;
    }
  });

  // Declare variable
  var linearVelocity;

  // Acceleration Value
  const forcePower = 0.8;

  // Turning Speed Value
  const turnPower = 0.1;

  // Forward Max Speed
  const forwardSpeed = 60;

  // Reverse Max Speed
  const reverseSpeed = 30;


  // Function for wheel rotation
  function wheelRotation(value) {
    wheelFR.rotate(BABYLON.Axis.Y, -value * linearVelocity / 100, BABYLON.Space.LOCAL);
    wheelFL.rotate(BABYLON.Axis.Y, -value * linearVelocity / 100, BABYLON.Space.LOCAL);
    wheelBR.rotate(BABYLON.Axis.Y, -value * linearVelocity / 100, BABYLON.Space.LOCAL);
    wheelBL.rotate(BABYLON.Axis.Y, -value * linearVelocity / 100, BABYLON.Space.LOCAL);
  }


  // Function to get current vehicle speed
  function getValue() {
    linearVelocity = (Math.sqrt(car.physicsImpostor.getLinearVelocity().x ** 2 + car.physicsImpostor.getLinearVelocity().z ** 2)).toFixed(3);
  }


  // Function for wheel turning
  var theta = 0;
  var deltaTheta = 0;

  // Function that run before evey frame
  scene.registerBeforeRender(function () {

    getValue();

    wheelRotation(direction);

    // Move Forward
    if (mf === true && linearVelocity < forwardSpeed) {
      translate(car, new BABYLON.Vector3(0, 0, 1), forcePower);
      direction = 1;
    }

    // Move Backward
    if (mb === true) {

      // Brake Condition
      if (direction == 1 && linearVelocity > 0) {
        car.physicsImpostor.friction = 5
        //console.log("Brake")
      }

      // Check if vehicle already stoped
      if (linearVelocity == 0) {
        direction = -1;
      }

      // Reverse condition
      if (direction == -1) {
        car.physicsImpostor.friction = 1
        if (linearVelocity < reverseSpeed) {
          translate(car, new BABYLON.Vector3(0, 0, -1), forcePower);
        }
        //console.log("Reverse")
      }
    }

    //Turn Left
    if (rl === true) {
      if (theta > -Math.PI / 6) {
        deltaTheta = -Math.PI / 100;
        theta += deltaTheta;
        pivotFR.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
        pivotFL.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
      }
      rotate(car, new BABYLON.Vector3(0, -1 * direction, 0), turnPower);
    }

    // Return wheel to straight position
    if (rl === false) {
      if (theta.toFixed(3) < 0) {
        deltaTheta = Math.PI / 80;
        theta += deltaTheta;
        pivotFR.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
        pivotFL.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
      }
    }

    // Turn Right
    if (rr === true) {
      if (theta < Math.PI / 6) {
        deltaTheta = Math.PI / 100;
        theta += deltaTheta;
        pivotFR.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
        pivotFL.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
      }
      rotate(car, new BABYLON.Vector3(0, 1 * direction, 0), turnPower);
    }

    // Return wheel to straight position
    if (rr === false) {
      if (theta.toFixed(3) > 0) {
        deltaTheta = -Math.PI / 80;
        theta += deltaTheta;
        pivotFR.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
        pivotFL.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
      }
    }

    console.log(car.physicsImpostor.friction)

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
