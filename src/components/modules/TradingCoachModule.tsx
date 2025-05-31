
import React, { useState } from 'react';
import { GraduationCap, BookOpen, Award, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const TradingCoachModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('courses');

  const courses = [
    { id: 1, title: 'Trading Basics', progress: 75, lessons: 12, duration: '4h' },
    { id: 2, title: 'Technical Analysis', progress: 45, lessons: 16, duration: '6h' },
    { id: 3, title: 'Risk Management', progress: 90, lessons: 8, duration: '3h' },
    { id: 4, title: 'Market Psychology', progress: 20, lessons: 10, duration: '5h' }
  ];

  const achievements = [
    { id: 1, title: 'First Trade', completed: true, icon: '🎯' },
    { id: 2, title: 'Risk Master', completed: true, icon: '🛡️' },
    { id: 3, title: 'Technical Analyst', completed: false, icon: '📊' },
    { id: 4, title: 'Portfolio Builder', completed: false, icon: '📈' }
  ];

  const glossary = [
    { term: 'Bull Market', definition: 'A market characterized by rising prices and optimism.' },
    { term: 'Bear Market', definition: 'A market characterized by falling prices and pessimism.' },
    { term: 'P/E Ratio', definition: 'Price-to-earnings ratio, a valuation metric.' },
    { term: 'Stop Loss', definition: 'An order to sell when price falls to a specific level.' }
  ];

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Trading Coach</h2>
        <p className="text-sm text-gray-600">Enhance your trading knowledge and skills</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="glossary">Terms</TabsTrigger>
          <TabsTrigger value="achievements">Awards</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{course.title}</h3>
                    <div className="text-xs text-gray-500">
                      {course.lessons} lessons • {course.duration}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Play size={14} className="mr-1" />
                    Continue
                  </Button>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="glossary" className="space-y-3">
          <div className="space-y-3">
            {glossary.map((item, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border">
                <div className="font-semibold text-gray-800 text-sm mb-1">{item.term}</div>
                <div className="text-xs text-gray-600">{item.definition}</div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-3">
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`p-3 rounded-lg border ${
                achievement.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className={`font-semibold text-sm ${
                      achievement.completed ? 'text-green-800' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {achievement.completed ? 'Completed' : 'Locked'}
                    </div>
                  </div>
                  {achievement.completed && (
                    <Award size={16} className="text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingCoachModule;
