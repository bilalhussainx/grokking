import { Module } from "../types";

export const ethicsInAIModule: Module = {
  id: "aiml-ethics",
  title: "Ethics in AI",
  description:
    "Examine the critical ethical challenges in AI: bias and fairness, privacy, transparency, job displacement, and responsible development. Learn frameworks for building AI systems that serve humanity well.",
  lessons: [
    {
      id: "aiml-bias-fairness",
      slug: "bias-and-fairness",
      title: "Bias and Fairness in ML",
      content: `## Bias and Fairness in ML

<!-- voice:section_check -->

Machine learning systems can perpetuate, amplify, and automate discrimination. Understanding how bias enters ML systems is not optional — it is a core engineering responsibility.

### How Bias Enters ML Systems

Bias can creep in at every stage of the ML pipeline:

**1. Data Collection Bias**

The training data reflects the world's existing inequalities:
- Amazon's hiring tool (scrapped in 2018) was trained on 10 years of resumes — mostly from men. It learned to penalize resumes containing the word "women's" (e.g., "women's chess club"). (Reuters, 2018)
- Image datasets overrepresent lighter skin tones, leading to facial recognition systems with higher error rates for darker-skinned individuals (Buolamwini & Gebru, 2018, "Gender Shades")

**2. Label Bias**

Human annotators bring their own biases when creating labels. A dataset labeled by people with one cultural perspective may not generalize.

**3. Feature Selection Bias**

Using zip code as a feature can serve as a proxy for race due to historical residential segregation, even if race is not explicitly included.

<!-- voice:key_insight -->

### Real-World Consequences

| System | Bias Found | Impact |
|--------|-----------|--------|
| COMPAS (criminal sentencing) | Higher false positive rate for Black defendants | Unfair sentencing recommendations |
| Google Photos (2015) | Labeled Black people as "gorillas" | Dehumanizing misclassification |
| Healthcare algorithm (2019) | Used healthcare spending (not health need) as proxy for illness severity | Black patients with same health conditions were scored as less sick (Obermeyer et al., *Science*, 2019) |

### Fairness Definitions

There are multiple mathematical definitions of fairness, and they are often **mutually incompatible** (Chouldechova, 2017):

- **Demographic Parity**: Equal selection rates across groups
- **Equal Opportunity**: Equal true positive rates across groups
- **Predictive Parity**: Equal precision across groups
- **Individual Fairness**: Similar individuals receive similar predictions

### Mitigation Strategies

1. **Diverse, representative training data**: Audit datasets for demographic balance
2. **Fairness constraints**: Add fairness metrics to the optimization objective
3. **Regular auditing**: Test model performance across demographic groups
4. **Human-in-the-loop**: Keep humans in the decision loop for high-stakes decisions
5. **Transparency**: Document model limitations and known biases (Model Cards, Mitchell et al., 2019)

### Key Takeaway

Bias in AI is a technical and social problem. Building fair systems requires diverse teams, representative data, mathematical fairness constraints, regular auditing, and humility about the limitations of any single model.

### Reflection Questions

- Can you think of a scenario where demographic parity and equal opportunity conflict?
- Should AI systems be held to a higher fairness standard than human decision-makers? Why or why not?

### Further Reading

- Buolamwini, J. & Gebru, T. (2018). "Gender Shades." *Conference on Fairness, Accountability, and Transparency*.
- Obermeyer, Z. et al. (2019). "Dissecting racial bias in an algorithm." *Science*, 366(6464).
- Mitchell, M. et al. (2019). "Model Cards for Model Reporting." *FAT Conference*.`,
    },
    {
      id: "aiml-privacy-transparency",
      slug: "privacy-and-transparency",
      title: "Privacy, Transparency & Responsible AI",
      content: `## Privacy, Transparency & Responsible AI

<!-- voice:section_check -->

Beyond fairness, AI raises profound questions about privacy, explainability, and the responsible use of powerful technologies.

### Privacy in the Age of AI

ML models can inadvertently memorize and expose private training data:

**Membership Inference Attacks**: An attacker can determine whether a specific data point was in the training set by examining the model's confidence on that point (Shokri et al., 2017).

**Model Inversion Attacks**: Given a model trained on face images, an attacker can reconstruct approximate face images from the model's outputs (Fredrikson et al., 2015).

**Training Data Extraction**: Large language models can sometimes regurgitate memorized training data, including personal information (Carlini et al., 2021).

### Privacy-Preserving Techniques

| Technique | How It Works | Tradeoff |
|-----------|-------------|----------|
| **Differential Privacy** | Adds controlled noise during training so no single data point significantly affects the model | Reduces model accuracy |
| **Federated Learning** | Train on data distributed across devices; only share model updates, not raw data | Higher communication costs |
| **Homomorphic Encryption** | Compute on encrypted data without decrypting | Very computationally expensive |

<!-- voice:key_insight -->

### The Black Box Problem

Deep neural networks with millions of parameters are often **opaque** — they make accurate predictions but cannot explain *why*. This is problematic in high-stakes domains:

- **Healthcare**: A doctor needs to understand why the model recommends a diagnosis
- **Criminal justice**: A defendant has the right to understand why they received a certain risk score
- **Lending**: Regulations (ECOA, GDPR Article 22) may require explanations for automated decisions

### Explainability Techniques

- **LIME** (Local Interpretable Model-agnostic Explanations): Approximates the model locally with an interpretable model to explain individual predictions
- **SHAP** (SHapley Additive exPlanations): Uses game theory to assign each feature a contribution to the prediction
- **Attention visualization**: In Transformers, attention weights show which input tokens the model focused on
- **Saliency maps**: In CNNs, highlight which pixels most influenced the prediction

### AI Governance Frameworks

Major frameworks for responsible AI development:

- **EU AI Act (2024)**: Risk-based regulation. Bans social scoring, requires transparency for high-risk systems.
- **NIST AI Risk Management Framework**: Voluntary framework for identifying and mitigating AI risks.
- **UNESCO Recommendation on AI Ethics (2021)**: Global ethical guidelines endorsed by 193 countries.

### The Dual-Use Dilemma

The same AI technology can be used for beneficial or harmful purposes:
- Face recognition: Finding missing children vs. mass surveillance
- Deepfakes: Creative filmmaking vs. misinformation
- Autonomous systems: Disaster rescue vs. autonomous weapons

There are no easy answers. Responsible AI development requires ongoing dialogue between technologists, policymakers, affected communities, and ethicists.

### Key Takeaway

Building responsible AI requires attending to privacy (differential privacy, federated learning), transparency (explainability tools), and governance (regulatory compliance). Technical solutions alone are insufficient — institutional and societal structures must evolve alongside the technology.

### Reflection Questions

- Should AI models be required to explain their decisions in all domains, or only high-stakes ones?
- How should the benefits and risks of dual-use AI technologies be balanced?`,
    },
    {
      id: "aiml-ethics-checkpoint",
      slug: "ethics-checkpoint",
      title: "Checkpoint: Ethics in AI",
      content: `## Checkpoint: Ethics in AI

<!-- voice:section_check -->

Review the ethical dimensions of AI before moving on to the capstone project.

---

### Question 1
Amazon's hiring tool (scrapped in 2018) discriminated against women because:

A) It was programmed with explicit gender bias
B) It was trained on historical hiring data that reflected existing gender imbalance in tech
C) Women applied to fewer positions
D) The model was not trained long enough

**Answer: B** — The model learned patterns from 10 years of resumes, most of which came from men. It learned to penalize features correlated with female applicants, such as the word "women's." The bias was in the training data, not the algorithm itself.

---

### Question 2
Why are multiple mathematical definitions of fairness often mutually incompatible?

A) Mathematicians have not found the right definition yet
B) Different definitions optimize for different statistical properties that cannot all be satisfied simultaneously (proven by Chouldechova, 2017)
C) Fairness is subjective and cannot be measured
D) Computing resources limit the number of fairness constraints

**Answer: B** — Chouldechova (2017) proved that when base rates differ between groups, it is mathematically impossible to simultaneously satisfy calibration, equal false positive rates, and equal false negative rates. Choosing a fairness definition involves value judgments.

---

### Question 3
What is a membership inference attack?

A) Hacking into a model's training server
B) Determining whether a specific data point was in the model's training set by analyzing its predictions
C) Stealing model weights through the API
D) Injecting malicious data into the training set

**Answer: B** — By examining how confidently a model predicts on a given data point, an attacker can infer whether that point was in the training data. Models tend to be more confident on training examples, creating a privacy leak.

---

### Question 4
LIME (Local Interpretable Model-agnostic Explanations) works by:

A) Visualizing the internal layers of the neural network
B) Approximating the complex model locally with a simple, interpretable model
C) Retraining the model with fewer features
D) Asking the model to generate its own explanations

**Answer: B** — LIME perturbs the input around a specific prediction and fits a simple model (like linear regression) to the local behavior. This provides an interpretable explanation of why the model made that particular prediction, without requiring access to the model's internals.

---

### Question 5
The EU AI Act classifies AI systems into risk tiers. Which use case would likely be classified as "high risk"?

A) A spam email filter
B) An AI-powered chess game
C) An AI system used for criminal sentencing recommendations
D) A music recommendation algorithm

**Answer: C** — The EU AI Act classifies systems that affect fundamental rights (criminal justice, healthcare, employment, education) as high-risk, requiring transparency, human oversight, and conformity assessments. Entertainment recommendations are low-risk.`,
    },
  ],
};
