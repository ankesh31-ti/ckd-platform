from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import numpy as np

app = FastAPI(title="CKD ML Prediction Service", version="1.0")

# Load model, scaler, and feature order ONCE at startup (not per-request)
model = joblib.load("ckd_random_forest_model.pkl")
scaler = joblib.load("ckd_scaler.pkl")
feature_columns = joblib.load("ckd_feature_columns.pkl")


class PatientInput(BaseModel):
    """
    Raw clinical values for one patient, matching the 24 features
    the model was trained on. Categorical fields use 0/1 encoding,
    matching the same mapping used during training:
      rbc, pc: 0=normal, 1=abnormal
      pcc, ba: 0=notpresent, 1=present
      htn, dm, cad, pe, ane: 0=no, 1=yes
      appet: 0=good, 1=poor
    """
    age: float
    bp: float = Field(..., description="Blood pressure (mm/Hg)")
    sg: float = Field(..., description="Urine specific gravity")
    al: float = Field(..., description="Albumin (0-5 scale)")
    su: float = Field(..., description="Sugar (0-5 scale)")
    rbc: int = Field(..., ge=0, le=1)
    pc: int = Field(..., ge=0, le=1)
    pcc: int = Field(..., ge=0, le=1)
    ba: int = Field(..., ge=0, le=1)
    bgr: float = Field(..., description="Blood glucose random (mg/dl)")
    bu: float = Field(..., description="Blood urea (mg/dl)")
    sc: float = Field(..., description="Serum creatinine (mg/dl)")
    sod: float = Field(..., description="Sodium (mEq/L)")
    pot: float = Field(..., description="Potassium (mEq/L)")
    hemo: float = Field(..., description="Hemoglobin (g/dl)")
    pcv: float = Field(..., description="Packed cell volume")
    wbcc: float = Field(..., description="White blood cell count (cells/cumm)")
    rbcc: float = Field(..., description="Red blood cell count (millions/cmm)")
    htn: int = Field(..., ge=0, le=1)
    dm: int = Field(..., ge=0, le=1)
    cad: int = Field(..., ge=0, le=1)
    appet: int = Field(..., ge=0, le=1)
    pe: int = Field(..., ge=0, le=1)
    ane: int = Field(..., ge=0, le=1)


class PredictionOutput(BaseModel):
    prediction: str          # "ckd" or "notckd"
    prediction_binary: int   # 0 or 1
    confidence_ckd: float    # probability of CKD, 0-1
    model_version: str = "random_forest_v1_full_features"


@app.get("/")
def health_check():
    return {"status": "ok", "service": "CKD ML Prediction Service"}


@app.post("/predict", response_model=PredictionOutput)
def predict(patient: PatientInput):
    try:
        input_dict = patient.dict()
        df_input = pd.DataFrame([input_dict])[feature_columns]

        scaled_input = pd.DataFrame(
            scaler.transform(df_input),
            columns=feature_columns
        )

        pred_binary = int(model.predict(scaled_input)[0])
        proba = model.predict_proba(scaled_input)[0]
        confidence_ckd = float(proba[1])

        return PredictionOutput(
            prediction="ckd" if pred_binary == 1 else "notckd",
            prediction_binary=pred_binary,
            confidence_ckd=round(confidence_ckd, 4)
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")
