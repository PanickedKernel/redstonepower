class MinecraftTable < ActiveRecord::Base
  self.abstract_class = true
  establish_connection :minecraft_database
end

class Player < MinecraftTable
  belongs_to :user
  has_many :stats
end

class Stat < MinecraftTable
end

class PlayerAchievement < MinecraftTable
end
