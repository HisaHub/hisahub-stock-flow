import React, { useState, useEffect } from 'react';
import { BookOpen, Award, GraduationCap, Play, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Course {
  id: string;
  title: string;
  progress: number;
  lessons: number;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
}

interface TradingCoachModuleProps {
  onDataChange?: (data: any) => void;
}

const TradingCoachModule: React.FC<TradingCoachModuleProps> = ({ onDataChange }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeSection, setActiveSection] = useState('courses');

  // Add learning progress data out of the map for easy reference
  const courses: Course[] = [
    {
      id: '1',
      title: 'Trading Basics',
      progress: 75,
      lessons: 12,
      duration: '4 hours',
      difficulty: 'Beginner',
      description: 'Learn fundamental trading concepts, market structure, and basic analysis techniques.'
    },
    {
      id: '2', 
      title: 'Technical Analysis',
      progress: 45,
      lessons: 16,
      duration: '6 hours',
      difficulty: 'Intermediate',
      description: 'Master chart patterns, indicators, and technical analysis tools for better trading decisions.'
    },
    {
      id: '3',
      title: 'Risk Management',
      progress: 20,
      lessons: 10,
      duration: '3 hours',
      difficulty: 'Beginner',
      description: 'Essential risk management strategies to protect your trading capital.'
    },
    {
      id: '4',
      title: 'Options Trading',
      progress: 60,
      lessons: 20,
      duration: '8 hours',
      difficulty: 'Advanced',
      description: 'Advanced options strategies for experienced traders seeking sophisticated techniques.'
    }
  ];

  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        learningProgress: courses.map(({ id, title, progress }) => ({ id, title, progress })),
        selectedCourse,
        activeSection
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse, activeSection]);

  const tradingTerms = [
    { term: 'Bull Market', definition: 'A market characterized by rising prices and investor optimism' },
    { term: 'Bear Market', definition: 'A market characterized by falling prices and investor pessimism' },
    { term: 'P/E Ratio', definition: 'Price-to-earnings ratio, a valuation metric comparing stock price to earnings' },
    { term: 'Stop Loss', definition: 'An order to sell a security when it reaches a certain price to limit losses' },
    { term: 'Volatility', definition: 'A measure of price fluctuation over time, indicating market uncertainty' }
  ];

  const achievements = [
    { title: 'First Steps', completed: true, description: 'Complete your first trading lesson' },
    { title: 'Risk Master', completed: true, description: 'Complete the risk management course' },
    { title: 'Technical Analyst', completed: false, description: 'Master technical analysis fundamentals' },
    { title: 'Portfolio Builder', completed: false, description: 'Build a diversified trading portfolio' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-3 md:p-6 h-full space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="text-blue-600" size={20} />
        <h2 className="text-lg md:text-xl font-bold text-gray-800">Trading Coach</h2>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeSection === 'courses' ? 'default' : 'ghost'}
          onClick={() => setActiveSection('courses')}
          size="sm"
          className="flex-1 text-xs"
        >
          Courses
        </Button>
        <Button
          variant={activeSection === 'glossary' ? 'default' : 'ghost'}
          onClick={() => setActiveSection('glossary')}
          size="sm"
          className="flex-1 text-xs"
        >
          Glossary
        </Button>
        <Button
          variant={activeSection === 'achievements' ? 'default' : 'ghost'}
          onClick={() => setActiveSection('achievements')}
          size="sm"
          className="flex-1 text-xs"
        >
          Awards
        </Button>
      </div>

      {/* Courses Section */}
      {activeSection === 'courses' && (
        <div className="space-y-4">
          {!selectedCourse ? (
            <>
              {/* Learning Progress Card */}
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-4">Your Learning Progress</h3>
                <div className="space-y-3">
                  {courses.map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{course.title}</span>
                        <span className="text-sm font-bold text-blue-600">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Selection */}
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-4">Available Courses</h3>
                <div className="space-y-2">
                  {courses.map((course) => (
                    <Button
                      key={course.id}
                      variant="outline"
                      onClick={() => setSelectedCourse(course)}
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <BookOpen size={16} className="text-blue-600" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{course.title}</div>
                          <div className="text-xs text-gray-600">{course.lessons} lessons • {course.duration}</div>
                        </div>
                        <Badge className={`text-xs ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </Badge>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Selected Course Detail */
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <Button 
                variant="outline" 
                onClick={() => setSelectedCourse(null)}
                size="sm"
                className="mb-4"
              >
                ← Back to Courses
              </Button>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{selectedCourse.title}</h3>
                    <Badge className={getDifficultyColor(selectedCourse.difficulty)}>
                      {selectedCourse.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{selectedCourse.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Lessons:</span>
                    <span className="font-bold ml-2">{selectedCourse.lessons}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-bold ml-2">{selectedCourse.duration}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Your Progress</span>
                    <span className="font-bold">{selectedCourse.progress}%</span>
                  </div>
                  <Progress value={selectedCourse.progress} className="h-4" />
                </div>

                <Button className="w-full">
                  <Play size={16} className="mr-2" />
                  {selectedCourse.progress > 0 ? 'Continue Learning' : 'Start Course'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trading Terms Glossary */}
      {activeSection === 'glossary' && (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">Trading Terms Glossary</h3>
          <div className="space-y-4">
            {tradingTerms.map((item, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="font-bold text-sm text-blue-600 mb-1">{item.term}</div>
                <div className="text-sm text-gray-600">{item.definition}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Section */}
      {activeSection === 'achievements' && (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="text-yellow-600" size={20} />
            <h3 className="font-semibold text-gray-700">Your Achievements</h3>
          </div>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className={`p-3 rounded-lg border ${
                achievement.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  {achievement.completed ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <Lock className="text-gray-400" size={20} />
                  )}
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${
                      achievement.completed ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </div>
                    <div className="text-xs text-gray-600">{achievement.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingCoachModule;
