import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our state
interface Experience {
  id: string;
  date: string;
  title: string;
  description: string;
  mood: 'happy' | 'neutral' | 'sad';
  tags: string[];
}

interface FinanceEntry {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
}

interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'cash' | 'investment' | 'property' | 'other';
}

interface Liability {
  id: string;
  name: string;
  value: number;
  interestRate?: number;
}

interface HealthEntry {
  id: string;
  date: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  water: number; // liters (was ounces)
  weight?: number; // kilograms (was pounds)
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number; // in kg (was lbs)
}

interface WorkoutEntry {
  id: string;
  date: string;
  name: string;
  exercises: Exercise[];
  duration: number; // in minutes
  notes?: string;
}

interface Goals {
  dailyCalories: number;
  dailyProtein: number;
  dailyWater: number;
  targetWeight?: number;
}

interface UserProfile {
  name: string;
  avatar?: string;
  goals: Goals;
  useMetricSystem: boolean; // New property to track unit preference
  currency: 'USD' | 'INR'; // Added currency preference
}

interface AppState {
  experiences: Experience[];
  finances: {
    entries: FinanceEntry[];
    assets: Asset[];
    liabilities: Liability[];
  };
  health: {
    entries: HealthEntry[];
    goals: Goals;
  };
  workouts: WorkoutEntry[];
  profile: UserProfile;
  isDarkMode: boolean;
}

// Create interface for the context
interface AppContextType {
  state: AppState;
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (experience: Experience) => void;
  deleteExperience: (id: string) => void;
  
  addFinanceEntry: (entry: Omit<FinanceEntry, 'id'>) => void;
  updateFinanceEntry: (entry: FinanceEntry) => void;
  deleteFinanceEntry: (id: string) => void;
  
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  updateAsset: (asset: Asset) => void;
  deleteAsset: (id: string) => void;
  
  addLiability: (liability: Omit<Liability, 'id'>) => void;
  updateLiability: (liability: Liability) => void;
  deleteLiability: (id: string) => void;
  
  addHealthEntry: (entry: Omit<HealthEntry, 'id'>) => void;
  updateHealthEntry: (entry: HealthEntry) => void;
  
  addWorkout: (workout: Omit<WorkoutEntry, 'id'>) => void;
  updateWorkout: (workout: WorkoutEntry) => void;
  deleteWorkout: (id: string) => void;
  
  updateProfile: (profile: Partial<UserProfile>) => void;
  toggleDarkMode: () => void;
  
  // Unit conversion utilities
  convertToKg: (lbs: number) => number;
  convertToLbs: (kg: number) => number;
  convertToLiters: (oz: number) => number;
  convertToOz: (liters: number) => number;
  toggleUnitSystem: () => void;
  
  // Derived data
  getNetWorth: () => number;
  getNetWorthHistory: () => {date: string, value: number}[];
  getWeightHistory: () => {date: string, value: number}[];
  getCalorieProgress: (date: string) => {consumed: number, goal: number};
  getWorkoutStats: () => {weeklyVolume: number, personalRecords: Record<string, number>};
}

// Create mock initial data
const initialState: AppState = {
  experiences: [
    {
      id: '1',
      date: '2025-05-19',
      title: 'Morning Run',
      description: 'Had a great 5k run this morning at the park',
      mood: 'happy',
      tags: ['exercise', 'outdoors']
    },
    {
      id: '2',
      date: '2025-05-18',
      title: 'Project Completion',
      description: 'Finally finished my dashboard project, very satisfied with the results',
      mood: 'happy',
      tags: ['work', 'coding']
    }
  ],
  finances: {
    entries: [
      {
        id: '1',
        date: '2025-05-19',
        amount: 2500,
        type: 'income',
        category: 'Salary',
        description: 'Monthly payment'
      },
      {
        id: '2',
        date: '2025-05-18',
        amount: 80,
        type: 'expense',
        category: 'Food',
        description: 'Grocery shopping'
      }
    ],
    assets: [
      {
        id: '1',
        name: 'Savings Account',
        value: 15000,
        type: 'cash'
      },
      {
        id: '2',
        name: 'Investment Portfolio',
        value: 45000,
        type: 'investment'
      }
    ],
    liabilities: [
      {
        id: '1',
        name: 'Student Loan',
        value: 12000,
        interestRate: 4.5
      }
    ]
  },
  health: {
    entries: [
      {
        id: '1',
        date: '2025-05-19',
        calories: 2100,
        protein: 140,
        carbs: 200,
        fat: 70,
        water: 1.9, // Updated from 64 oz to 1.9 liters
        weight: 79.4 // Updated from 175 lbs to 79.4 kg
      },
      {
        id: '2',
        date: '2025-05-18',
        calories: 2300,
        protein: 150,
        carbs: 220,
        fat: 75,
        water: 2.1, // Updated from 72 oz to 2.1 liters
        weight: 79.6 // Updated from 175.5 lbs to 79.6 kg
      }
    ],
    goals: {
      dailyCalories: 2200,
      dailyProtein: 160,
      dailyWater: 2.4, // Updated from 80 oz to 2.4 liters
      targetWeight: 77 // Updated from 170 lbs to 77 kg
    }
  },
  workouts: [
    {
      id: '1',
      date: '2025-05-19',
      name: 'Upper Body Day',
      exercises: [
        { id: '101', name: 'Bench Press', sets: 4, reps: 8, weight: 84 }, // Updated from 185 lbs to 84 kg
        { id: '102', name: 'Pull-ups', sets: 4, reps: 10, weight: 0 }
      ],
      duration: 45
    },
    {
      id: '2',
      date: '2025-05-17',
      name: 'Leg Day',
      exercises: [
        { id: '201', name: 'Squats', sets: 4, reps: 10, weight: 102 }, // Updated from 225 lbs to 102 kg
        { id: '202', name: 'Lunges', sets: 3, reps: 12, weight: 18 } // Updated from 40 lbs to 18 kg
      ],
      duration: 50,
      notes: 'Felt strong today'
    }
  ],
  profile: {
    name: 'Alex Morgan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    goals: {
      dailyCalories: 2200,
      dailyProtein: 160,
      dailyWater: 2.4, // Updated from 80 oz to 2.4 liters
      targetWeight: 77 // Updated from 170 lbs to 77 kg
    },
    useMetricSystem: true, // Default to metric system
    currency: 'INR' // Default to INR for India
  },
  isDarkMode: true
};

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(initialState);

  // Generate a unique ID helper function
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Load data from localStorage on init
  useEffect(() => {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      setState(JSON.parse(savedState));
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  // Unit conversion utilities
  const convertToKg = (lbs: number): number => {
    return parseFloat((lbs / 2.20462).toFixed(1));
  };

  const convertToLbs = (kg: number): number => {
    return parseFloat((kg * 2.20462).toFixed(1));
  };

  const convertToLiters = (oz: number): number => {
    return parseFloat((oz * 0.0295735).toFixed(1));
  };

  const convertToOz = (liters: number): number => {
    return parseFloat((liters / 0.0295735).toFixed(0));
  };

  const toggleUnitSystem = () => {
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        useMetricSystem: !prev.profile.useMetricSystem
      }
    }));
  };

  // Experience methods
  const addExperience = (experience: Omit<Experience, 'id'>) => {
    setState(prev => ({
      ...prev,
      experiences: [
        { id: generateId(), ...experience },
        ...prev.experiences
      ]
    }));
  };

  const updateExperience = (experience: Experience) => {
    setState(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => 
        e.id === experience.id ? experience : e
      )
    }));
  };

  const deleteExperience = (id: string) => {
    setState(prev => ({
      ...prev,
      experiences: prev.experiences.filter(e => e.id !== id)
    }));
  };

  // Finance methods
  const addFinanceEntry = (entry: Omit<FinanceEntry, 'id'>) => {
    setState(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        entries: [
          { id: generateId(), ...entry },
          ...prev.finances.entries
        ]
      }
    }));
  };

  const updateFinanceEntry = (entry: FinanceEntry) => {
    setState(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        entries: prev.finances.entries.map(e => 
          e.id === entry.id ? entry : e
        )
      }
    }));
  };

  const deleteFinanceEntry = (id: string) => {
    setState(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        entries: prev.finances.entries.filter(e => e.id !== id)
      }
    }));
  };

  const addAsset = (asset: Omit<Asset, 'id'>) => {
    setState(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        assets: [
          { id: generateId(), ...asset },
          ...prev.finances.assets
        ]
      }
    }));
  };

  const updateAsset = (asset: Asset) => {
    setState(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        assets: prev.finances.assets.map(a => 
          a.id === asset.id ? asset : a
        )
      }
    }));
  };

  const deleteAsset = (id: string) => {
    setState(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        assets: prev.finances.assets.filter(a => a.id !== id)
      }
    }));
  };

  const addLiability = (liability: Omit<Liability, 'id'>) => {
    setState(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        liabilities: [
          { id: generateId(), ...liability },
          ...prev.finances.liabilities
        ]
      }
    }));
  };

  const updateLiability = (liability: Liability) => {
    setState(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        liabilities: prev.finances.liabilities.map(l => 
          l.id === liability.id ? liability : l
        )
      }
    }));
  };

  const deleteLiability = (id: string) => {
    setState(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        liabilities: prev.finances.liabilities.filter(l => l.id !== id)
      }
    }));
  };

  // Health methods
  const addHealthEntry = (entry: Omit<HealthEntry, 'id'>) => {
    setState(prev => ({
      ...prev,
      health: {
        ...prev.health,
        entries: [
          { id: generateId(), ...entry },
          ...prev.health.entries
        ]
      }
    }));
  };

  const updateHealthEntry = (entry: HealthEntry) => {
    setState(prev => ({
      ...prev,
      health: {
        ...prev.health,
        entries: prev.health.entries.map(e => 
          e.id === entry.id ? entry : e
        )
      }
    }));
  };

  // Workout methods
  const addWorkout = (workout: Omit<WorkoutEntry, 'id'>) => {
    setState(prev => ({
      ...prev,
      workouts: [
        { id: generateId(), ...workout },
        ...prev.workouts
      ]
    }));
  };

  const updateWorkout = (workout: WorkoutEntry) => {
    setState(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => 
        w.id === workout.id ? workout : w
      )
    }));
  };

  const deleteWorkout = (id: string) => {
    setState(prev => ({
      ...prev,
      workouts: prev.workouts.filter(w => w.id !== id)
    }));
  };

  // Profile methods
  const updateProfile = (profile: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profile
      }
    }));
  };

  const toggleDarkMode = () => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  // Derived data methods
  const getNetWorth = (): number => {
    const totalAssets = state.finances.assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalLiabilities = state.finances.liabilities.reduce((sum, liability) => sum + liability.value, 0);
    return totalAssets - totalLiabilities;
  };

  // Update getNetWorthHistory to use INR
  const getNetWorthHistory = () => {
    // In a real app, this would calculate based on historical data
    // For now, we'll just return mock data in INR (roughly converted)
    return [
      { date: '2025-01-01', value: 3300000 },  // ~40000 USD → INR
      { date: '2025-02-01', value: 3465000 },  // ~42000 USD → INR
      { date: '2025-03-01', value: 3588750 },  // ~43500 USD → INR
      { date: '2025-04-01', value: 3712500 },  // ~45000 USD → INR
      { date: '2025-05-01', value: 3960000 },  // ~48000 USD → INR
    ];
  };

  // Update getWeightHistory to correctly handle metric units
  const getWeightHistory = () => {
    return state.health.entries
      .filter(entry => entry.weight)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(entry => ({
        date: entry.date,
        value: entry.weight as number
      }));
  };

  const getCalorieProgress = (date: string) => {
    const entry = state.health.entries.find(e => e.date === date);
    return {
      consumed: entry?.calories || 0,
      goal: state.health.goals.dailyCalories
    };
  };

  const getWorkoutStats = () => {
    // Calculate weekly volume (sum of sets * reps * weight across all exercises in the past 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentWorkouts = state.workouts.filter(w => 
      new Date(w.date) >= oneWeekAgo
    );
    
    let weeklyVolume = 0;
    recentWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        weeklyVolume += exercise.sets * exercise.reps * exercise.weight;
      });
    });
    
    // Calculate personal records (max weight for each exercise)
    const personalRecords: Record<string, number> = {};
    state.workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (!personalRecords[exercise.name] || exercise.weight > personalRecords[exercise.name]) {
          personalRecords[exercise.name] = exercise.weight;
        }
      });
    });
    
    return { weeklyVolume, personalRecords };
  };

  return (
    <AppContext.Provider value={{
      state,
      addExperience,
      updateExperience,
      deleteExperience,
      addFinanceEntry,
      updateFinanceEntry,
      deleteFinanceEntry,
      addAsset,
      updateAsset,
      deleteAsset,
      addLiability,
      updateLiability,
      deleteLiability,
      addHealthEntry,
      updateHealthEntry,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      updateProfile,
      toggleDarkMode,
      getNetWorth,
      getNetWorthHistory,
      getWeightHistory,
      getCalorieProgress,
      getWorkoutStats,
      // Add conversion utilities
      convertToKg,
      convertToLbs,
      convertToLiters,
      convertToOz,
      toggleUnitSystem
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
