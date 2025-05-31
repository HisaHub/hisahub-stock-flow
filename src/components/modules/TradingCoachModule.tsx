
import React, { useState } from 'react';
import { BookOpen, Award, TrendingUp, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Course {
  id: string;
  title: string;
  progress: number;
  lessons: number;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const TradingCoachModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const courses: Course[] = [
    {
      id: '1',
      title: 'Trading Basics',
      progress: 75,
      lessons: 12,
      duration: '4 hours',
      difficulty: 'Beginner'
    },
    {
      id: '2',
      title: 'Technical Analysis',
      progress: 45,
      lessons: 16,
      duration: '6 hours',
      difficulty: 'Intermediate'
    },
    {
      id: '3',
      title: 'Risk Management',
      progress: 20,
      lessons: 10,
      duration: '3 hours',
      difficulty: 'Beginner'
    },
    {
      id: '4',
      title: 'Options Trading',
      progress: 0,
      lessons: 20,
      duration: '8 hours',
      difficulty: 'Advanced'
    }
  ];

  const achievements = [
    { title: 'First Trade', completed: true, description: 'Complete your first trade' },
    { title: 'Risk Master', completed: true, description: 'Complete risk management course' },
    { title: 'Technical Analyst', completed: false, description: 'Master technical analysis' },
    { title: 'Portfolio Builder', completed: false, description: 'Build diversified portfolio' }
  ];

  const tradingTerms = [
    { term: 'Bull Market', definition: 'A market characterized by rising prices' },
    { term: 'Bear Market', definition: 'A market characterized by falling prices' },
    { term: 'P/E Ratio', definition: 'Price-to-earnings ratio, valuation metric' },
    { term: 'Stop Loss', definition: 'Order to sell when price drops to certain level' },
    { term: 'Volatility', definition: 'Measure of price fluctuation over time' }
  ];

  return (
    <div className="p-3 md:p-6 h-full space-y-4 md:space-y-6">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">Trading Coach</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1 mb-4">
            <TabsTrigger value="courses" className="text-xs px-2 py-1">Courses</TabsTrigger>
            <TabsTrigger value="progress" className="text-xs px-2 py-1">Progress</TabsTrigger>
            <TabsTrigger value="terms" className="text-xs px-2 py-1">Terms</TabsTrigger>
            <TabsTrigger value="achievements" className="text-xs px-2 py-1">Awards</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-3 md:space-y-4">
            {!selectedCourse ? (
              <div className="space-y-3">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white p-3 md:p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm md:text-base text-gray-800">{course.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{course.difficulty}</span>
                          <span className="text-xs text-gray-600">{course.lessons} lessons</span>
                          <span className="text-xs text-gray-600">{course.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => setSelectedCourse(course)}
                    >
                      {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-3 md:p-4 rounded-lg border">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mb-3 text-xs"
                  onClick={() => setSelectedCourse(null)}
                >
                  ← Back to Courses
                </Button>
                <h3 className="font-semibold text-base md:text-lg text-gray-800 mb-2">{selectedCourse.title}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span>Difficulty:</span>
                    <span className="font-semibold">{selectedCourse.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span>Lessons:</span>
                    <span className="font-semibold">{selectedCourse.lessons}</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span>Duration:</span>
                    <span className="font-semibold">{selectedCourse.duration}</span>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Your Progress</span>
                      <span>{selectedCourse.progress}%</span>
                    </div>
                    <Progress value={selectedCourse.progress} className="h-3" />
                  </div>
                  <Button className="w-full text-xs md:text-sm">
                    {selectedCourse.progress > 0 ? 'Continue Learning' : 'Start Course'}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-3 md:space-y-4">
            <div className="bg-white p-3 md:p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">Overall Progress</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Courses Completed</span>
                    <span>1/4</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Total Learning Hours</span>
                    <span>8.5/21</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Achievements Unlocked</span>
                    <span>2/4</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="terms" className="space-y-3 md:space-y-4">
            <div className="bg-white p-3 md:p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">Trading Glossary</h3>
              <div className="space-y-2">
                {tradingTerms.map((item, index) => (
                  <div key={index} className="border-b pb-2 last:border-b-0">
                    <div className="font-semibold text-xs md:text-sm text-blue-600">{item.term}</div>
                    <div className="text-xs text-gray-600 break-words">{item.definition}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-3 md:space-y-4">
            <div className="bg-white p-3 md:p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">Achievements</h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    achievement.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Award 
                        size={16} 
                        className={achievement.completed ? 'text-green-600' : 'text-gray-400'} 
                      />
                      <span className={`font-semibold text-xs md:text-sm ${
                        achievement.completed ? 'text-green-800' : 'text-gray-600'
                      }`}>
                        {achievement.title}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">{achievement.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TradingCoachModule;
